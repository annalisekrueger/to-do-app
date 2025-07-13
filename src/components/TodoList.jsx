import TodoItem from './TodoItem'

function TodoList({
  todos,
  getCategoryName,
  toggleTodo,
  deleteTodo,
  expandedNotes,
  editingNotes,
  toggleNotes,
  startEditingNotes,
  saveNotes,
  cancelEditingNotes,
  themeName,
  onCyclePriority
}) {
  return (
    <div>
      <h2 className="text-2xl font-light text-stone-800 mb-4">{themeName}</h2>
      <div className="space-y-2">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            getCategoryName={getCategoryName}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            expandedNotes={expandedNotes}
            editingNotes={editingNotes}
            toggleNotes={toggleNotes}
            startEditingNotes={startEditingNotes}
            saveNotes={saveNotes}
            cancelEditingNotes={cancelEditingNotes}
            onCyclePriority={onCyclePriority}
          />
        ))}
      </div>
      {todos.length === 0 && (
        <div className="text-center py-8">
          <p className="text-stone-500 font-light">No {themeName.toLowerCase()} tasks</p>
        </div>
      )}
    </div>
  )
}

export default TodoList 