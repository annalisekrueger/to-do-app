import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Tasks from './components/Tasks'
import Calendar from './components/Calendar'
import Analytics from './components/Analytics'
import Settings from './components/Settings'

function App() {
  const [currentPage, setCurrentPage] = useState('tasks')

  const renderPage = () => {
    switch (currentPage) {
      case 'tasks':
        return <Tasks />
      case 'calendar':
        return <Calendar />
      case 'analytics':
        return <Analytics />
      case 'settings':
        return <Settings />
      default:
        return <Tasks />
    }
  }

  return (
    <div className="flex h-screen bg-stone-50">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1 overflow-auto">
        {renderPage()}
      </div>
    </div>
  )
}

export default App
