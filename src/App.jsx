import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import ManageCategoriesDropdown from './components/ManageCategoriesDropdown'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import { supabase } from './supabaseClient'

function App() {
  const [todos, setTodos] = useState([])
  const [categories, setCategories] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [filter, setFilter] = useState('all')
  const [expandedNotes, setExpandedNotes] = useState({})
  const [editingNotes, setEditingNotes] = useState({})
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryType, setNewCategoryType] = useState('personal')
  
  const isInitialLoad = useRef(true)

  // Confetti function
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Fetch all data from Supabase
  const fetchAllData = async () => {
    try {
      const [tasksResult, categoriesResult] = await Promise.all([
        supabase.from('tasks').select('*'),
        supabase.from('categories').select('*')
      ]);

      if (tasksResult.data) setTodos(tasksResult.data);
      if (categoriesResult.data) {
        setCategories(categoriesResult.data);
        // Set default selectedCategory to first available UUID
        if (categoriesResult.data.length > 0 && !selectedCategory) {
          setSelectedCategory(categoriesResult.data[0].id);
        }
      }

      if (tasksResult.error) console.error('Error fetching tasks:', tasksResult.error);
      if (categoriesResult.error) console.error('Error fetching categories:', categoriesResult.error);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      alert('Please select a category before adding a task.');
      return;
    }
    if (inputValue.trim()) {
      const newTodo = {
        title: inputValue.trim(),
        category_id: selectedCategory,
        created_at: new Date().toISOString(),
        priority: 'medium',
      };
      
      try {
        const { error } = await supabase.from('tasks').insert([newTodo]);
        if (error) {
          console.error('Error adding task:', error);
          alert('Error adding task: ' + error.message);
        } else {
          setInputValue('');
          await fetchAllData();
        }
      } catch (error) {
        console.error('Error adding task:', error);
        alert('Error adding task');
      }
    }
  }

  const addCategory = async (e) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      const newCategory = {
        name: newCategoryName.trim(),
        type: newCategoryType,
      };
      
      try {
        const { error } = await supabase.from('categories').insert([newCategory]);
        if (error) {
          console.error('Error adding category:', error);
          alert('Error adding category: ' + error.message);
        } else {
          setNewCategoryName('');
          setShowAddCategory(false);
          await fetchAllData();
        }
      } catch (error) {
        console.error('Error adding category:', error);
        alert('Error adding category');
      }
    }
  }

  const deleteCategory = async (categoryId) => {
    try {
      const { error } = await supabase.from('categories').delete().eq('id', categoryId);
      if (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category: ' + error.message);
      } else {
        // If the currently selected category is deleted, reset to the first available
        if (selectedCategory === categoryId) {
          const remainingCategories = categories.filter(cat => cat.id !== categoryId);
          if (remainingCategories.length > 0) {
            setSelectedCategory(remainingCategories[0].id);
          } else {
            setSelectedCategory('');
          }
        }
        await fetchAllData();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category');
    }
  }

  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const updatedTodo = { ...todo, completed: !todo.completed };
    
    try {
      const { error } = await supabase.from('tasks').update({ completed: updatedTodo.completed }).eq('id', id);
      if (error) {
        console.error('Error updating task:', error);
      } else {
        setTodos(todos.map(t => t.id === id ? updatedTodo : t));
        
        // Trigger confetti when task is completed (not when uncompleted)
        if (updatedTodo.completed) {
          triggerConfetti();
        }
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  const deleteTodo = async (id) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) {
        console.error('Error deleting task:', error);
      } else {
        setTodos(todos.filter(t => t.id !== id));
        setExpandedNotes(prev => {
          const newState = { ...prev }
          delete newState[id]
          return newState
        })
        setEditingNotes(prev => {
          const newState = { ...prev }
          delete newState[id]
          return newState
        })
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    
    try {
      const { error } = await supabase.from('tasks').delete().in('id', completedTodos.map(t => t.id));
      if (error) {
        console.error('Error clearing completed tasks:', error);
      } else {
        const completedIds = completedTodos.map(todo => todo.id);
        setTodos(todos.filter(todo => !todo.completed));
        setExpandedNotes(prev => {
          const newState = { ...prev }
          completedIds.forEach(id => delete newState[id])
          return newState
        })
        setEditingNotes(prev => {
          const newState = { ...prev }
          completedIds.forEach(id => delete newState[id])
          return newState
        })
      }
    } catch (error) {
      console.error('Error clearing completed tasks:', error);
    }
  }

  const toggleNotes = (id) => {
    setExpandedNotes(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const startEditingNotes = (id) => {
    setEditingNotes(prev => ({
      ...prev,
      [id]: true
    }))
  }

  const saveNotes = async (id, notes, due_date, reminder) => {
    const updateObj = {};
    if (notes !== undefined) updateObj.notes = notes;
    if (due_date !== undefined) updateObj.due_date = due_date;
    if (reminder !== undefined) updateObj.reminder = reminder;
    
    try {
      const { error } = await supabase.from('tasks').update(updateObj).eq('id', id);
      if (error) {
        console.error('Error updating notes:', error);
      } else {
        setTodos(todos.map(todo => 
          todo.id === id ? { ...todo, ...updateObj } : todo
        ));
        setEditingNotes(prev => ({
          ...prev,
          [id]: false
        }))
      }
    } catch (error) {
      console.error('Error updating notes:', error);
    }
  }

  const cancelEditingNotes = (id) => {
    setEditingNotes(prev => ({
      ...prev,
      [id]: false
    }))
  }

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : 'Unknown'
  }

  const getCategoryType = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.type : 'personal'
  }

  const handleCyclePriority = async (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const current = todo.priority || 'medium';
    const next = current === 'low' ? 'medium' : current === 'medium' ? 'high' : 'low';
    
    try {
      const { error } = await supabase.from('tasks').update({ priority: next }).eq('id', id);
      if (error) {
        console.error('Error updating priority:', error);
      } else {
        setTodos(todos.map(t => 
          t.id === id ? { ...t, priority: next } : t
        ));
      }
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const activeCount = todos.filter(todo => !todo.completed).length
  const completedCount = todos.filter(todo => todo.completed).length

  // Group todos by category type
  const todosByType = {
    personal: filteredTodos.filter(todo => getCategoryType(todo.category_id) === 'personal'),
    work: filteredTodos.filter(todo => getCategoryType(todo.category_id) === 'work')
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-stone-800 mb-2">Tasks</h1>
          <p className="text-stone-600 font-light">Annalise Krueger</p>
        </div>

        {/* Add Todo Form */}
        <TodoForm
          inputValue={inputValue}
          setInputValue={setInputValue}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          addTodo={addTodo}
        />

        {/* Manage Categories Dropdown */}
        <ManageCategoriesDropdown
          show={showAddCategory}
          onToggle={() => setShowAddCategory(!showAddCategory)}
          newCategoryName={newCategoryName}
          setNewCategoryName={setNewCategoryName}
          newCategoryType={newCategoryType}
          setNewCategoryType={setNewCategoryType}
          addCategory={addCategory}
          categories={categories}
          deleteCategory={deleteCategory}
        />

        {/* Status Filters */}
        <div className="flex justify-center gap-2 mb-6">
          {[
            { key: 'all', label: 'All', count: todos.length },
            { key: 'active', label: 'Active', count: activeCount },
            { key: 'completed', label: 'Done', count: completedCount }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg font-light transition-colors duration-200 ${
                filter === key
                  ? 'bg-stone-800 text-white'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {/* Todo Lists by Type */}
        <div className="grid md:grid-cols-2 gap-8">
          <TodoList
            todos={todosByType.personal}
            getCategoryName={getCategoryName}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            expandedNotes={expandedNotes}
            editingNotes={editingNotes}
            toggleNotes={toggleNotes}
            startEditingNotes={startEditingNotes}
            saveNotes={saveNotes}
            cancelEditingNotes={cancelEditingNotes}
            themeName="Personal"
            onCyclePriority={handleCyclePriority}
          />
          <TodoList
            todos={todosByType.work}
            getCategoryName={getCategoryName}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            expandedNotes={expandedNotes}
            editingNotes={editingNotes}
            toggleNotes={toggleNotes}
            startEditingNotes={startEditingNotes}
            saveNotes={saveNotes}
            cancelEditingNotes={cancelEditingNotes}
            themeName="Work"
            onCyclePriority={handleCyclePriority}
          />
        </div>

        {/* Clear Completed */}
        {completedCount > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={clearCompleted}
              className="text-stone-500 hover:text-stone-700 font-light transition-colors duration-200"
            >
              Clear completed
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
