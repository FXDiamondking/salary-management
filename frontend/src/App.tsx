import { Layout } from './components/Layout/Layout'
import { Dashboard } from './components/Dashboard/Dashboard'
import { EmployeeDirectory } from './components/EmployeeDirectory/EmployeeDirectory'

function App() {
  const path = window.location.pathname;

  return (
    <Layout>
      {path === '/' ? <Dashboard /> : 
       path === '/employees' ? <EmployeeDirectory /> : 
       <div className="flex items-center justify-center min-h-[400px]">
         <div className="glass rounded-2xl p-8 text-center">
           <h2 className="text-xl font-bold mb-2">Page not found</h2>
           <p className="text-slate-500">The page you're looking for doesn't exist.</p>
           <a href="/" className="inline-block mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium hover:shadow-lg transition-all">
             Go to Dashboard
           </a>
         </div>
       </div>}
    </Layout>
  )
}

export default App
