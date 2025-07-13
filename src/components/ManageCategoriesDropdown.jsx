import { AnimatePresence, motion } from 'framer-motion'

function ManageCategoriesDropdown({
  show, onToggle, newCategoryName, setNewCategoryName, newCategoryType, setNewCategoryType, addCategory, categories, deleteCategory
}) {
  return (
    <div className="mb-8">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 text-stone-600 hover:text-stone-800 font-light transition-colors duration-200"
      >
        <span>Manage Categories</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${show ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence>
        {show && (
          <motion.div
            key="manage-categories-dropdown"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="mt-4 p-4 bg-white rounded-lg border border-stone-200 shadow"
          >
            {/* Add Category Form */}
            <form onSubmit={addCategory} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Category name..."
                  className="flex-1 px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-400 font-light"
                />
                <select
                  value={newCategoryType}
                  onChange={(e) => setNewCategoryType(e.target.value)}
                  className="px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-400 font-light bg-white"
                >
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors duration-200 font-light"
                >
                  Add
                </button>
              </div>
            </form>
            {/* Manage Categories Section */}
            <h3 className="text-lg font-light text-stone-700 mb-2">Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-light text-stone-600 mb-1">Personal</h4>
                <ul>
                  {categories && categories.filter(cat => cat.type === 'personal').map(category => (
                    <li key={category.id} className="flex items-center gap-2 py-1">
                      <span>{category.name}</span>
                      <button
                        type="button"
                        onClick={() => deleteCategory(category.id)}
                        className="text-stone-400 hover:text-red-500 transition-colors duration-200"
                        title="Delete category"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-light text-stone-600 mb-1">Work</h4>
                <ul>
                  {categories && categories.filter(cat => cat.type === 'work').map(category => (
                    <li key={category.id} className="flex items-center gap-2 py-1">
                      <span>{category.name}</span>
                      <button
                        type="button"
                        onClick={() => deleteCategory(category.id)}
                        className="text-stone-400 hover:text-red-500 transition-colors duration-200"
                        title="Delete category"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ManageCategoriesDropdown 