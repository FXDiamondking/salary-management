import { useEffect, useState, useRef } from 'react';
import { api, type AnalyticsSummary } from '../../lib/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
  PieChart, Pie
} from 'recharts';
import { DollarSign, Users, Briefcase, Globe, TrendingUp, Hash } from 'lucide-react';

// Animated number counter hook
function useAnimatedNumber(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafId = useRef<number>(0);

  useEffect(() => {
    startTime.current = null;
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(Math.round(target * eased));
      if (progress < 1) rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, [target, duration]);

  return value;
}

// Skeleton card
function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="skeleton w-10 h-10 rounded-xl" />
        <div className="skeleton h-4 w-24 rounded" />
      </div>
      <div className="skeleton h-8 w-32 rounded" />
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="skeleton h-5 w-48 rounded mb-6" />
      <div className="skeleton h-[300px] w-full rounded-xl" />
    </div>
  );
}

// Stat card with gradient icon and animated counter
function StatCard({ title, value, icon, gradient, delay }: {
  title: string; value: string; icon: React.ReactNode; gradient: string; delay: number;
}) {
  return (
    <div className={`gradient-border glass rounded-2xl p-6 flex flex-col gap-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl animate-fade-up`} style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
          {icon}
        </div>
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h3>
      </div>
      <p className="text-3xl font-bold tracking-tight animate-number">{value}</p>
    </div>
  );
}

const CHART_COLORS = [
  '#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b',
  '#ef4444', '#ec4899', '#14b8a6', '#f97316', '#84cc16',
];

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

  // Animated values
  const animatedTotal = useAnimatedNumber(data?.totalPayroll ?? 0);
  const animatedAvg = useAnimatedNumber(data?.averagePayroll ?? 0);
  const animatedMedian = useAnimatedNumber(data?.medianSalary ?? 0);
  const animatedCount = useAnimatedNumber(data?.totalEmployees ?? 0);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  if (error) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="glass rounded-2xl p-8 text-center max-w-md">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-red-500 text-xl">!</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{error}</p>
      </div>
    </div>
  );

  if (loading) return (
    <div className="space-y-8">
      <div>
        <div className="skeleton h-8 w-48 rounded mb-2" />
        <div className="skeleton h-4 w-72 rounded" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SkeletonChart />
        <SkeletonChart />
      </div>
    </div>
  );

  if (!data) return null;

  // Prepare headcount data (top 10 countries by headcount)
  const headcountData = [...data.byCountry]
    .sort((a, b) => b.employeeCount - a.employeeCount)
    .slice(0, 10);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-up">
        <h2 className="text-3xl font-bold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400">
            Analytics Overview
          </span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Real-time salary insights across {data.totalEmployees.toLocaleString()} employees worldwide.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Payroll"
          value={formatCurrency(animatedTotal)}
          icon={<DollarSign className="w-5 h-5 text-white" />}
          gradient="from-indigo-500 to-purple-600"
          delay={50}
        />
        <StatCard
          title="Average Salary"
          value={formatCurrency(animatedAvg)}
          icon={<TrendingUp className="w-5 h-5 text-white" />}
          gradient="from-cyan-500 to-blue-600"
          delay={100}
        />
        <StatCard
          title="Median Salary"
          value={formatCurrency(animatedMedian)}
          icon={<Briefcase className="w-5 h-5 text-white" />}
          gradient="from-violet-500 to-fuchsia-600"
          delay={150}
        />
        <StatCard
          title="Total Employees"
          value={animatedCount.toLocaleString()}
          icon={<Users className="w-5 h-5 text-white" />}
          gradient="from-emerald-500 to-teal-600"
          delay={200}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Avg Salary by Department */}
        <div className="glass rounded-2xl p-6 animate-fade-up stagger-4">
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-semibold">Average Salary by Department</h3>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byDepartment} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="rgba(148,163,184,0.1)" />
                <XAxis type="number" tickFormatter={(val) => `$${val / 1000}k`} tick={{ fontSize: 11 }} />
                <YAxis dataKey="groupName" type="category" width={110} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => formatCurrency(Number(val))}
                  contentStyle={{
                    background: 'rgba(15,23,42,0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    color: '#fff',
                    fontSize: '13px',
                  }}
                />
                <Bar dataKey="averageSalary" radius={[0, 6, 6, 0]}>
                  {data.byDepartment.map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Avg Salary by Country */}
        <div className="glass rounded-2xl p-6 animate-fade-up stagger-5">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-cyan-500" />
            <h3 className="text-lg font-semibold">Average Salary by Country</h3>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byCountry}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="groupName" tick={{ fontSize: 10, angle: -45 }} height={60} textAnchor="end" />
                <YAxis tickFormatter={(val) => `$${val / 1000}k`} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => formatCurrency(Number(val))}
                  contentStyle={{
                    background: 'rgba(15,23,42,0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    color: '#fff',
                    fontSize: '13px',
                  }}
                />
                <Bar dataKey="averageSalary" radius={[6, 6, 0, 0]}>
                  {data.byCountry.map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 — Headcount Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Headcount by Country (Top 10) */}
        <div className="glass rounded-2xl p-6 animate-fade-up stagger-6">
          <div className="flex items-center gap-2 mb-6">
            <Hash className="w-5 h-5 text-emerald-500" />
            <h3 className="text-lg font-semibold">Headcount by Country (Top 10)</h3>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={headcountData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="rgba(148,163,184,0.1)" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="groupName" type="category" width={110} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`${Number(val).toLocaleString()} employees`, 'Headcount']}
                  contentStyle={{
                    background: 'rgba(15,23,42,0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    color: '#fff',
                    fontSize: '13px',
                  }}
                />
                <Bar dataKey="employeeCount" radius={[0, 6, 6, 0]}>
                  {headcountData.map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Salary Expenditure Pie */}
        <div className="glass rounded-2xl p-6 animate-fade-up stagger-6">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold">Salary Expenditure by Department</h3>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.byDepartment}
                  dataKey="totalSalary"
                  nameKey="groupName"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={110}
                  paddingAngle={3}
                  stroke="none"
                >
                  {data.byDepartment.map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => formatCurrency(Number(val))}
                  contentStyle={{
                    background: 'rgba(15,23,42,0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    color: '#fff',
                    fontSize: '13px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
