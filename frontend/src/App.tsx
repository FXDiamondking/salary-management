import { Layout } from './components/Layout/Layout'
import { Dashboard } from './components/Dashboard/Dashboard'
import { EmployeeDirectory } from './components/EmployeeDirectory/EmployeeDirectory'

function App() {
  // Using simple routing for now, we can add React Router later if needed
  const path = window.location.pathname;

  return (
    <Layout>
      {path === '/' ? <Dashboard /> : 
       path === '/employees' ? <EmployeeDirectory /> : 
       <div className="text-center p-12 text-slate-500">Page not found</div>}
    </Layout>
  )
}

export default App
