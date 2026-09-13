const API_URL = import.meta.env.VITE_API_URL || '/api';

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  jobTitle: string;
  department: string;
  country: string;
  salary: number;
  currency: string;
}

export interface GroupedAnalytics {
  groupName: string;
  averageSalary: number;
  totalSalary: number;
  employeeCount: number;
}

export interface AnalyticsSummary {
  totalPayroll: number;
  averagePayroll: number;
  medianSalary: number;
  totalEmployees: number;
  byCountry: GroupedAnalytics[];
  byDepartment: GroupedAnalytics[];
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface EmployeeFilters {
  search?: string;
  country?: string;
  department?: string;
  minSalary?: number;
  maxSalary?: number;
  sort?: string;   // e.g. "salary,desc"
}

export const api = {
  getAnalyticsSummary: async (): Promise<AnalyticsSummary> => {
    const res = await fetch(`${API_URL}/analytics/summary`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  getEmployees: async (page = 0, size = 20, filters?: EmployeeFilters): Promise<Page<Employee>> => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (filters?.search) params.set('search', filters.search);
    if (filters?.country) params.set('country', filters.country);
    if (filters?.department) params.set('department', filters.department);
    if (filters?.minSalary !== undefined) params.set('minSalary', String(filters.minSalary));
    if (filters?.maxSalary !== undefined) params.set('maxSalary', String(filters.maxSalary));
    if (filters?.sort) params.set('sort', filters.sort);
    
    const res = await fetch(`${API_URL}/employees?${params}`);
    if (!res.ok) throw new Error('Failed to fetch employees');
    return res.json();
  },

  getEmployee: async (id: number): Promise<Employee> => {
    const res = await fetch(`${API_URL}/employees/${id}`);
    if (!res.ok) throw new Error('Failed to fetch employee');
    return res.json();
  },

  updateSalary: async (id: number, salary: number, currency: string = 'USD'): Promise<Employee> => {
    const res = await fetch(`${API_URL}/employees/${id}/salary`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ salary, currency }),
    });
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.error || 'Failed to update salary');
    }
    return res.json();
  },

  getCountries: async (): Promise<string[]> => {
    const res = await fetch(`${API_URL}/filters/countries`);
    if (!res.ok) throw new Error('Failed to fetch countries');
    return res.json();
  },

  getDepartments: async (): Promise<string[]> => {
    const res = await fetch(`${API_URL}/filters/departments`);
    if (!res.ok) throw new Error('Failed to fetch departments');
    return res.json();
  },
};
