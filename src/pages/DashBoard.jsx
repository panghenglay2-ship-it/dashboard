import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  doc, getDoc,
  collection, getDocs,
  orderBy, query, limit,
} from "firebase/firestore";
import StatCard from '../components/StartCard'
import { RevenueChart, OrdersChart, CategoryChart } from "../components/Charts";
import RecentOrders from "../components/RecentOrders";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // ✅ Load stats
        const statsDoc = await getDoc(doc(db, "stats", "overview"));
        if (statsDoc.exists()) setStats(statsDoc.data());

        // ✅ Load recent orders
        const ordersQuery = query(
          collection(db, "orders"),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const ordersSnap = await getDocs(ordersQuery);
        setRecentOrders(
          ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
        );

        // ✅ Load products for category chart
        const productsSnap = await getDocs(collection(db, "products"));
        const products = productsSnap.docs.map((d) => d.data());

        // Group by category
        const categories = products.reduce((acc, p) => {
          const existing = acc.find((c) => c.name === p.category);
          if (existing) existing.value += 1;
          else acc.push({ name: p.category, value: 1 });
          return acc;
        }, []);
        setCategoryData(categories);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers?.toLocaleString() || "0",
      icon: "👥",
      change: 12,
      color: "bg-blue-600/20",
    },
    {
      title: "Total Revenue",
      value: `$${stats?.totalRevenue?.toLocaleString() || "0"}`,
      icon: "💰",
      change: 8,
      color: "bg-green-600/20",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts?.toLocaleString() || "0",
      icon: "📦",
      change: 3,
      color: "bg-purple-600/20",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders?.toLocaleString() || "0",
      icon: "📋",
      change: 15,
      color: "bg-orange-600/20",
    },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-white text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">
          Welcome back! Here's what's happening.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={stats?.revenueData || []} />
        <OrdersChart data={stats?.ordersData || []} />
      </div>

      {/* Charts Row 2 + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart data={categoryData} />
        <RecentOrders orders={recentOrders} />
      </div>

    </div>
  );
}

export default Dashboard;