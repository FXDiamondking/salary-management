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
  byCountry: GroupedAnalytics[];
  byDepartment: GroupedAnalytics[];
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page index
}

export const api = {
  getAnalyticsSummary: async (): Promise<AnalyticsSummary> => {
    const res = await fetch(`${API_URL}/analytics/summary`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  getEmployees: async (page = 0, size = 20): Promise<Page<Employee>> => {
    const res = await fetch(`${API_URL}/employees?page=${page}&size=${size}`);
    if (!res.ok) throw new Error('Failed to fetch employees');
    return res.json();
  },

  updateSalary: async (id: number, salary: number, currency: string = 'USD'): Promise<Employee> => {
    const res = await fetch(`${API_URL}/employees/${id}/salary`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ salary, currency }),
    });
    if (!res.ok) throw new Error('Failed to update salary');
    return res.json();
  }
};
