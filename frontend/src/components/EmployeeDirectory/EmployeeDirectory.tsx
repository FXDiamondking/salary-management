import { useEffect, useState } from 'react';
import { api, type Employee, type Page } from '../../lib/api';
import { Search, ChevronLeft, ChevronRight, Edit2, Check, X } from 'lucide-react';

export function EmployeeDirectory() {
  const [data, setData] = useState<Page<Employee> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editSalary, setEditSalary] = useState<string>('');

  const fetchEmployees = async (pageNum: number) => {
    setLoading(true);
    try {
      const result = await api.getEmployees(pageNum, 15);
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(page);
  }, [page]);

  const handleSaveSalary = async (id: number) => {
    try {
      const numSalary = parseFloat(editSalary);
      if (isNaN(numSalary)) return;
      
      await api.updateSalary(id, numSalary);
      setEditingId(null);
      fetchEmployees(page); // refresh current page
    } catch (err) {
      console.error("Failed to update", err);
    }
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Employee Directory</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage salaries for 10,000 employees.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input 
            type="text" 
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm" 
            placeholder="Search employees... (Mocked)" 
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Country</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Salary</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">Loading...</td></tr>
              ) : data?.content.map((employee) => (
                <tr key={employee.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
                        {employee.firstName[0]}{employee.lastName[0]}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="text-sm text-slate-500">{employee.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                    {employee.jobTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                      {employee.country}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                    {editingId === employee.id ? (
                      <input 
                        type="number" 
                        value={editSalary} 
                        onChange={e => setEditSalary(e.target.value)}
                        className="w-32 px-2 py-1 border border-blue-500 rounded-md bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    ) : (
                      formatCurrency(employee.salary)
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingId === employee.id ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleSaveSalary(employee.id)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 bg-green-50 dark:bg-green-900/30 p-1.5 rounded-md transition-colors">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-700 p-1.5 rounded-md transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditingId(employee.id); setEditSalary(employee.salary.toString()); }} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 p-1.5 rounded-md transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {data && (
          <div className="bg-white dark:bg-slate-800 px-4 py-3 flex items-center justify-between border-t border-slate-200 dark:border-slate-700 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="relative inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 disabled:opacity-50">
                Previous
              </button>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= data.totalPages - 1} className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 disabled:opacity-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Showing <span className="font-medium">{page * 15 + 1}</span> to <span className="font-medium">{Math.min((page + 1) * 15, data.totalElements)}</span> of{' '}
                  <span className="font-medium">{data.totalElements}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors">
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Page {page + 1} of {data.totalPages}
                  </span>
                  <button onClick={() => setPage(p => p + 1)} disabled={page >= data.totalPages - 1} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors">
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
