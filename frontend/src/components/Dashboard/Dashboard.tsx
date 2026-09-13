export function Dashboard() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-slate-500 dark:text-slate-400">Overview of organization payroll and statistics.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Placeholder cards */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col gap-2 transition-all hover:shadow-md">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Metric {i}</h3>
            <p className="text-2xl font-bold">---</p>
          </div>
        ))}
      </div>
    </div>
  );
}
