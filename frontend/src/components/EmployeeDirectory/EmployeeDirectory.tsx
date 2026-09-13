import { useEffect, useState, useCallback } from 'react';
import { api, type Employee, type Page, type EmployeeFilters } from '../../lib/api';
import {
  Search, ChevronLeft, ChevronRight, Edit2, Check, X,
  ArrowUpDown, ArrowUp, ArrowDown, Filter, Eye, XCircle, AlertCircle
} from 'lucide-react';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// Skeleton row
function SkeletonRow() {
  return (
    <tr>
      <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="skeleton w-10 h-10 rounded-full" /><div><div className="skeleton h-4 w-28 rounded mb-1" /><div className="skeleton h-3 w-20 rounded" /></div></div></td>
      <td className="px-6 py-4"><div className="skeleton h-4 w-32 rounded" /></td>
      <td className="px-6 py-4"><div className="skeleton h-6 w-20 rounded-full" /></td>
      <td className="px-6 py-4"><div className="skeleton h-4 w-24 rounded" /></td>
      <td className="px-6 py-4 text-right"><div className="skeleton h-8 w-8 rounded-lg ml-auto" /></td>
    </tr>
  );
}

export function EmployeeDirectory() {
  const [data, setData] = useState<Page<Employee> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  // Editing
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editSalary, setEditSalary] = useState<string>('');
  const [editError, setEditError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Search & Filters
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Sort
  const [sortField, setSortField] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Filter options
  const [countries, setCountries] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);

  // Detail modal
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Load filter options
  useEffect(() => {
    api.getCountries().then(setCountries).catch(console.error);
    api.getDepartments().then(setDepartments).catch(console.error);
  }, []);

  const fetchEmployees = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const filters: EmployeeFilters = {};
      if (debouncedSearch) filters.search = debouncedSearch;
      if (selectedCountry) filters.country = selectedCountry;
      if (selectedDepartment) filters.department = selectedDepartment;
      if (sortField) filters.sort = `${sortField},${sortDir}`;

      const result = await api.getEmployees(pageNum, 15, filters);
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedCountry, selectedDepartment, sortField, sortDir]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, selectedCountry, selectedDepartment, sortField, sortDir]);

  useEffect(() => {
    fetchEmployees(page);
  }, [page, fetchEmployees]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />;
    return sortDir === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-indigo-500" /> : <ArrowDown className="w-3.5 h-3.5 text-indigo-500" />;
  };

  const handleSaveSalary = async (id: number) => {
    setEditError(null);
    const numSalary = parseFloat(editSalary);
    if (isNaN(numSalary) || numSalary < 0) {
      setEditError('Salary must be a non-negative number');
      return;
    }
    setSaving(true);
    try {
      await api.updateSalary(id, numSalary);
      setEditingId(null);
      setEditError(null);
      fetchEmployees(page);
    } catch (err: any) {
      setEditError(err.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const clearFilters = () => {
    setSearchInput('');
    setSelectedCountry('');
    setSelectedDepartment('');
    setSortField('');
  };

  const hasActiveFilters = debouncedSearch || selectedCountry || selectedDepartment;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-up">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400">
              Employee Directory
            </span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {data ? `${data.totalElements.toLocaleString()} employees` : 'Loading...'} · Manage salaries across the organization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              showFilters || hasActiveFilters
                ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                : 'glass hover:bg-white/50 dark:hover:bg-white/5'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
            )}
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3 animate-fade-up stagger-1">
        {/* Search bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="block w-full pl-11 pr-10 py-3 glass rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            placeholder="Search by name or job title..."
          />
          {searchInput && (
            <button onClick={() => setSearchInput('')} className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <XCircle className="h-4 w-4 text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>

        {/* Filter dropdowns */}
        {showFilters && (
          <div className="flex flex-wrap gap-3 glass rounded-xl p-4 animate-fade-up">
            <select
              value={selectedCountry}
              onChange={e => setSelectedCountry(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            >
              <option value="">All Countries</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={selectedDepartment}
              onChange={e => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            >
              <option value="">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-all">
                <X className="w-3.5 h-3.5" /> Clear all
              </button>
            )}
          </div>
        )}

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {debouncedSearch && (
              <span className="filter-chip">
                Search: "{debouncedSearch}"
                <button onClick={() => setSearchInput('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedCountry && (
              <span className="filter-chip">
                Country: {selectedCountry}
                <button onClick={() => setSelectedCountry('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedDepartment && (
              <span className="filter-chip">
                Dept: {selectedDepartment}
                <button onClick={() => setSelectedDepartment('')}><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden animate-fade-up stagger-2">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200/50 dark:divide-white/5">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-white/[0.02]">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('firstName')} className="sort-btn flex items-center gap-1.5">
                    Employee <SortIcon field="firstName" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('jobTitle')} className="sort-btn flex items-center gap-1.5">
                    Role <SortIcon field="jobTitle" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('country')} className="sort-btn flex items-center gap-1.5">
                    Country <SortIcon field="country" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('salary')} className="sort-btn flex items-center gap-1.5">
                    Salary <SortIcon field="salary" />
                  </button>
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50 dark:divide-white/5">
              {loading ? (
                [...Array(8)].map((_, i) => <SkeletonRow key={i} />)
              ) : data?.content.map((employee) => (
                <tr
                  key={employee.id}
                  className="table-row-glow cursor-pointer"
                  onClick={() => setSelectedEmployee(employee)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                        {employee.firstName[0]}{employee.lastName[0]}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold">{employee.firstName} {employee.lastName}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{employee.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                    {employee.jobTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10">
                      {employee.country}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold" onClick={e => e.stopPropagation()}>
                    {editingId === employee.id ? (
                      <div className="flex flex-col gap-1">
                        <input
                          type="number"
                          value={editSalary}
                          onChange={e => { setEditSalary(e.target.value); setEditError(null); }}
                          className={`w-32 px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                            editError ? 'border-red-500 focus:ring-red-500/50' : 'border-indigo-500/50 focus:ring-indigo-500/50'
                          } bg-white dark:bg-slate-900`}
                          autoFocus
                          min="0"
                          onKeyDown={e => { if (e.key === 'Enter') handleSaveSalary(employee.id); if (e.key === 'Escape') setEditingId(null); }}
                        />
                        {editError && (
                          <span className="flex items-center gap-1 text-xs text-red-500">
                            <AlertCircle className="w-3 h-3" />{editError}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400">{formatCurrency(employee.salary)}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={e => e.stopPropagation()}>
                    {editingId === employee.id ? (
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleSaveSalary(employee.id)}
                          disabled={saving}
                          className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setEditingId(null); setEditError(null); }}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedEmployee(employee)}
                          className="p-2 rounded-lg hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-500 transition-all"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setEditingId(employee.id); setEditSalary(employee.salary.toString()); setEditError(null); }}
                          className="p-2 rounded-lg hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-500 transition-all"
                          title="Edit salary"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100/50 dark:border-white/5">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{page * 15 + 1}</span> to{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-200">{Math.min((page + 1) * 15, data.totalElements)}</span> of{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-200">{data.totalElements.toLocaleString()}</span>
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/5 disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="px-4 py-2 text-sm font-medium glass rounded-lg">
                {page + 1} / {data.totalPages}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= data.totalPages - 1}
                className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/5 disabled:opacity-30 transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex justify-end modal-overlay" onClick={() => setSelectedEmployee(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md glass-strong h-full overflow-y-auto modal-panel"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 space-y-6">
              {/* Close */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Employee Details</h3>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Avatar */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-400 via-purple-500 to-cyan-400 flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-indigo-500/30">
                  {selectedEmployee.firstName[0]}{selectedEmployee.lastName[0]}
                </div>
                <div className="text-center">
                  <h4 className="text-xl font-bold">{selectedEmployee.firstName} {selectedEmployee.lastName}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{selectedEmployee.jobTitle}</p>
                </div>
              </div>

              {/* Details grid */}
              <div className="space-y-4">
                {[
                  { label: 'Department', value: selectedEmployee.department },
                  { label: 'Country', value: selectedEmployee.country },
                  { label: 'Salary', value: formatCurrency(selectedEmployee.salary) },
                  { label: 'Currency', value: selectedEmployee.currency },
                  { label: 'Employee ID', value: `#${selectedEmployee.id}` },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center py-3 border-b border-slate-100/50 dark:border-white/5">
                    <span className="text-sm text-slate-500 dark:text-slate-400">{item.label}</span>
                    <span className="text-sm font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Edit salary button */}
              <button
                onClick={() => {
                  setSelectedEmployee(null);
                  setEditingId(selectedEmployee.id);
                  setEditSalary(selectedEmployee.salary.toString());
                  setEditError(null);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium text-sm hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
              >
                Edit Salary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
