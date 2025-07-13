function TodoForm({ inputValue, setInputValue, selectedCategory, setSelectedCategory, categories, addTodo }) {
  const personalCategories = (categories || []).filter(cat => cat.type === 'personal');
  const workCategories = (categories || []).filter(cat => cat.type === 'work');

  return (
    <form onSubmit={addTodo} className="mb-8">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-400 font-light"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-400 font-light bg-white"
        >
          <option value="">Select category...</option>
          {personalCategories.length > 0 && (
            <optgroup label="Personal">
              {personalCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </optgroup>
          )}
          {workCategories.length > 0 && (
            <optgroup label="Work">
              {workCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </optgroup>
          )}
        </select>
        <button
          type="submit"
          className="px-6 py-3 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors duration-200 font-light"
          disabled={!selectedCategory}
        >
          Add
        </button>
      </div>
    </form>
  )
}

export default TodoForm 