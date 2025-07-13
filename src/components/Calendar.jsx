import { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import { supabase } from '../supabaseClient'
import 'react-calendar/dist/Calendar.css'

function CalendarPage() {
  const [date, setDate] = useState(new Date())
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedDateTasks, setSelectedDateTasks] = useState([])

  // Fetch tasks and categories from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksResult, categoriesResult] = await Promise.all([
          supabase.from('tasks').select('*').not('due_date', 'is', null),
          supabase.from('categories').select('*')
        ]);

        if (tasksResult.data) setTasks(tasksResult.data);
        if (categoriesResult.data) setCategories(categoriesResult.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Get tasks for selected date
  useEffect(() => {
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    const tasksForDate = tasks.filter(task => {
      if (!task.due_date) return false;
      const taskDate = new Date(task.due_date).toISOString().split('T')[0];
      return taskDate === dateStr;
    });
    setSelectedDateTasks(tasksForDate);
  }, [date, tasks]);

  // Get category info
  const getCategoryInfo = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? { name: category.name, type: category.type } : { name: 'Unknown', type: 'personal' };
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  // Check if a date has tasks
  const hasTasksOnDate = (calendarDate) => {
    const dateStr = calendarDate.toISOString().split('T')[0];
    return tasks.some(task => {
      if (!task.due_date) return false;
      const taskDate = new Date(task.due_date).toISOString().split('T')[0];
      return taskDate === dateStr;
    });
  };

  // Custom tile content to show task indicators
  const tileContent = ({ date: tileDate, view }) => {
    if (view === 'month' && hasTasksOnDate(tileDate)) {
      const dateStr = tileDate.toISOString().split('T')[0];
      const tasksCount = tasks.filter(task => {
        if (!task.due_date) return false;
        const taskDate = new Date(task.due_date).toISOString().split('T')[0];
        return taskDate === dateStr;
      }).length;

      return (
        <div className="flex justify-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
          {tasksCount > 1 && (
            <span className="text-xs text-blue-600 ml-1">{tasksCount}</span>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-light text-stone-800 mb-2">Calendar</h1>
        <p className="text-stone-600 font-light">View your tasks by due date</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <Calendar
              onChange={setDate}
              value={date}
              tileContent={tileContent}
              className="w-full border-none"
              tileClassName={({ date: tileDate, view }) => {
                if (view === 'month' && hasTasksOnDate(tileDate)) {
                  return 'has-tasks';
                }
                return null;
              }}
            />
          </div>
        </div>

        {/* Tasks for Selected Date */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <h3 className="text-lg font-light text-stone-800 mb-4">
              Tasks for {date.toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h3>

            {selectedDateTasks.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-stone-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-stone-500 font-light">No tasks due on this date</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateTasks.map((task) => {
                  const categoryInfo = getCategoryInfo(task.category_id);
                  return (
                    <div
                      key={task.id}
                      className={`border-l-4 rounded-lg p-4 ${getPriorityColor(task.priority)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`font-medium text-stone-800 ${task.completed ? 'line-through text-stone-500' : ''}`}>
                            {task.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded">
                              {categoryInfo.name}
                            </span>
                            <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded">
                              {task.priority} priority
                            </span>
                          </div>
                          {task.notes && (
                            <p className="text-sm text-stone-600 mt-2">{task.notes}</p>
                          )}
                        </div>
                        {task.completed && (
                          <div className="ml-2">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg border border-stone-200 p-6 mt-6">
            <h3 className="text-lg font-light text-stone-800 mb-4">Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-stone-600">Total tasks with due dates</span>
                <span className="font-medium text-stone-800">{tasks.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Completed</span>
                <span className="font-medium text-green-600">
                  {tasks.filter(t => t.completed).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Pending</span>
                <span className="font-medium text-orange-600">
                  {tasks.filter(t => !t.completed).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">High priority</span>
                <span className="font-medium text-red-600">
                  {tasks.filter(t => t.priority === 'high' && !t.completed).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .react-calendar {
          border: none !important;
          font-family: inherit;
        }
        
        .react-calendar__tile {
          position: relative;
          padding: 0.75em 0.5em;
          border: none !important;
          background: none;
          color: #57534e;
          font-size: 0.875rem;
        }
        
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: #f5f5f4 !important;
        }
        
        .react-calendar__tile--active {
          background: #1c1917 !important;
          color: white !important;
        }
        
        .react-calendar__tile.has-tasks {
          background-color: #dbeafe !important;
        }
        
        .react-calendar__tile.has-tasks:hover {
          background-color: #bfdbfe !important;
        }
        
        .react-calendar__navigation button {
          color: #57534e;
          font-size: 1rem;
          font-weight: 300;
        }
        
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: #f5f5f4;
        }
      `}</style>
    </div>
  )
}

export default CalendarPage 