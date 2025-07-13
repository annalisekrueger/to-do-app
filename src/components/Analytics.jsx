function Analytics() {
  return (
    <div className="p-8">
      <div className="text-center">
        <h1 className="text-3xl font-light text-stone-800 mb-2">Analytics</h1>
        <p className="text-stone-600 font-light mb-8">Track your productivity insights</p>
        
        <div className="bg-white rounded-lg border border-stone-200 p-12">
          <svg className="w-16 h-16 text-stone-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="text-lg font-light text-stone-600 mb-2">Coming Soon</h3>
          <p className="text-stone-500">Analytics dashboard with completion rates, productivity trends, and insights.</p>
        </div>
      </div>
    </div>
  )
}

export default Analytics 