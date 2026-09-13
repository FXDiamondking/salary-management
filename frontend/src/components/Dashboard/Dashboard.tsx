import { useEffect, useState } from 'react';
import { api, type AnalyticsSummary } from '../../lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DollarSign, Users, Briefcase, Globe } from 'lucide-react';

export function Dashboard() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getAnalyticsSummary()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-12 text-center text-slate-500">Loading dashboard...</div>;
  if (error) return <div className="p-12 text-center text-red-500">Error: {error}</div>;
  if (!data) return null;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Analytics Overview</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">High-level statistics on organization payroll.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Payroll" value={formatCurrency(data.totalPayroll)} icon={<DollarSign className="w-5 h-5" />} />
        <StatCard title="Average Salary" value={formatCurrency(data.averagePayroll)} icon={<Briefcase className="w-5 h-5" />} />
        <StatCard title="Countries" value={data.byCountry.length.toString()} icon={<Globe className="w-5 h-5" />} />
        <StatCard title="Departments" value={data.byDepartment.length.toString()} icon={<Users className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold mb-6 text-slate-800 dark:text-slate-200">Average Salary by Department</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byDepartment} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" tickFormatter={(val) => `$${val/1000}k`} />
                <YAxis dataKey="groupName" type="category" width={100} tick={{fontSize: 12}} />
                <Tooltip formatter={(val: number) => formatCurrency(val)} />
                <Bar dataKey="averageSalary" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold mb-6 text-slate-800 dark:text-slate-200">Average Salary by Country</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byCountry}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="groupName" tick={{fontSize: 12}} />
                <YAxis tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip formatter={(val: number) => formatCurrency(val)} />
                <Bar dataKey="averageSalary" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col gap-3 transition-all hover:shadow-md hover:-translate-y-1">
      <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-blue-600 dark:text-blue-400">
          {icon}
        </div>
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}
