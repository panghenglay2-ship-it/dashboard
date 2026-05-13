const STATUS_COLORS = {
  Delivered: "bg-green-500/10 text-green-400",
  Pending: "bg-yellow-500/10 text-yellow-400",
  Processing: "bg-blue-500/10 text-blue-400",
  Cancelled: "bg-red-500/10 text-red-400",
};

function RecentOrders({ orders }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <h3 className="text-white font-bold text-lg mb-6">
        🕐 Recent Orders
      </h3>

      {orders.length === 0 ? (
        <p className="text-slate-500 text-center py-8">No orders yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-slate-400 text-sm border-b border-slate-700">
                <th className="text-left pb-3">Customer</th>
                <th className="text-left pb-3">Email</th>
                <th className="text-left pb-3">Total</th>
                <th className="text-left pb-3">Status</th>
                <th className="text-left pb-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="text-sm">
                  <td className="py-3 text-white font-semibold">
                    {order.customerName}
                  </td>
                  <td className="py-3 text-slate-400">{order.email}</td>
                  <td className="py-3 text-white font-semibold">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RecentOrders;