function StartCard({ title, value, icon, change, color }) {
  const isPositive = change >= 0;
  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-colors">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-slate-400 text-sm">{title}</p>
          <h3 className="text-white text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div
          className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-2xl`}
        >
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}
        >
          {isPositive ? '↑' : '↓'} {Math.abs(change)}%
        </span>
        <span className="text-slate-500 text-sm">vs last month</span>
      </div>
    </div>
  );
}
export default StartCard;
