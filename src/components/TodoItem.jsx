import { useState, useEffect } from 'react'

function getPriorityColor(priority) {
  if (priority === 'high') return 'border-red-300';
  if (priority === 'medium') return 'border-yellow-300';
  if (priority === 'low') return 'border-green-300';
  return 'border-stone-200';
}

function TodoItem({
  todo,
  getCategoryName,
  toggleTodo,
  deleteTodo,
  expandedNotes,
  editingNotes,
  toggleNotes,
  startEditingNotes,
  saveNotes,
  cancelEditingNotes,
  onCyclePriority
}) {
  const priority = todo.priority || 'medium';
  const borderColor = getPriorityColor(priority);

  // Controlled state for notes, due_date, reminder in edit mode
  const [editNotes, setEditNotes] = useState(todo.notes || '');
  const [editDueDate, setEditDueDate] = useState(todo.due_date || '');
  const [editReminder, setEditReminder] = useState(todo.reminder || '');

  // Reset edit fields when entering edit mode
  useEffect(() => {
    if (editingNotes[todo.id]) {
      setEditNotes(todo.notes || '');
      setEditDueDate(todo.due_date || '');
      setEditReminder(todo.reminder || '');
    }
  }, [editingNotes, todo.id, todo.notes, todo.due_date, todo.reminder]);

  return (
    <div
      className={`bg-white rounded-lg border ${borderColor} cursor-pointer hover:bg-stone-50`}
      onClick={() => onCyclePriority(todo.id)}
      title="Click to change priority"
    >
      {/* Main Task Row */}
      <div className="flex items-center gap-3 p-4">
        <button
          onClick={e => { e.stopPropagation(); toggleTodo(todo.id); }}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
            todo.completed
              ? 'bg-stone-800 border-stone-800'
              : 'border-stone-300 hover:border-stone-400'
          }`}
          title="Toggle completed"
        >
          {todo.completed && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span
            className={`font-light ${
              todo.completed
                ? 'text-stone-400 line-through'
                : 'text-stone-800'
            }`}
          >
            {todo.title}
          </span>
          <span className="text-stone-500 text-sm font-light">
            {getCategoryName(todo.category_id)}
          </span>
        </div>
        {/* Notes Toggle Button */}
        <button
          onClick={e => { e.stopPropagation(); toggleNotes(todo.id); }}
          className="text-stone-400 hover:text-stone-600 transition-colors duration-200 flex-shrink-0"
          title="Toggle notes"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
        <button
          onClick={e => { e.stopPropagation(); deleteTodo(todo.id); }}
          className="text-stone-400 hover:text-stone-600 transition-colors duration-200 flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {/* Notes Section */}
      {expandedNotes[todo.id] && (
        <div className="border-t border-stone-100 p-4" onClick={e => e.stopPropagation()}>
          <div className="mb-2 italic text-sm text-stone-500">
            {priority.charAt(0).toUpperCase() + priority.slice(1)} priority
          </div>
          {editingNotes[todo.id] ? (
            <div className="space-y-3">
              <textarea
                value={editNotes}
                onChange={e => setEditNotes(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-400 font-light text-sm resize-none"
                rows="3"
                placeholder="Add notes..."
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={editDueDate}
                  onChange={e => setEditDueDate(e.target.value)}
                  className="px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-400 font-light text-sm"
                />
                <input
                  type="time"
                  value={editReminder}
                  onChange={e => setEditReminder(e.target.value)}
                  className="px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-400 font-light text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => saveNotes(todo.id, editNotes, editDueDate, editReminder)}
                  className="px-3 py-1 bg-stone-800 text-white text-sm rounded hover:bg-stone-700 transition-colors duration-200"
                >
                  Save
                </button>
                <button
                  onClick={() => cancelEditingNotes(todo.id)}
                  className="px-3 py-1 bg-stone-100 text-stone-600 text-sm rounded hover:bg-stone-200 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              {todo.notes && (
                <div className="space-y-2">
                  <p className="text-stone-600 text-sm font-light whitespace-pre-wrap">
                    {todo.notes}
                  </p>
                </div>
              )}
              {todo.due_date && (
                <div className="text-xs text-stone-500">
                  Due: {todo.due_date}
                </div>
              )}
              {todo.reminder && (
                <div className="text-xs text-stone-500">
                  Reminder: {todo.reminder}
                </div>
              )}
              <button
                onClick={() => startEditingNotes(todo.id)}
                className="text-stone-500 hover:text-stone-700 text-sm font-light transition-colors duration-200"
              >
                {(todo.notes || todo.due_date || todo.reminder) ? 'Edit' : 'Add'} notes / due date
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TodoItem 