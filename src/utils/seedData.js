import { db } from "../firebase";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";

export const seedDatabase = async () => {
  // Products
  const products = [
    { name: "Nike Air Max", price: 99.99, category: "Shoes", stock: 50, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" },
    { name: "Adidas Hoodie", price: 59.99, category: "Clothing", stock: 30, image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400" },
    { name: "Sony Headphones", price: 149.99, category: "Electronics", stock: 20, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
    { name: "Apple Watch", price: 299.99, category: "Electronics", stock: 15, image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400" },
    { name: "Leather Backpack", price: 79.99, category: "Bags", stock: 25, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400" },
  ];

  for (const product of products) {
    await addDoc(collection(db, "products"), {
      ...product,
      createdAt: Date.now(),
    });
  }

  // Orders
  const orders = [
    { customerName: "Dara", email: "dara@gmail.com", total: 99.99, status: "Delivered", items: 1, createdAt: Date.now() - 86400000 },
    { customerName: "Sokha", email: "sokha@gmail.com", total: 209.98, status: "Pending", items: 2, createdAt: Date.now() - 172800000 },
    { customerName: "Bopha", email: "bopha@gmail.com", total: 149.99, status: "Processing", items: 1, createdAt: Date.now() - 259200000 },
    { customerName: "Rith", email: "rith@gmail.com", total: 379.98, status: "Delivered", items: 2, createdAt: Date.now() - 345600000 },
    { customerName: "Chanty", email: "chanty@gmail.com", total: 59.99, status: "Cancelled", items: 1, createdAt: Date.now() - 432000000 },
  ];

  for (const order of orders) {
    await addDoc(collection(db, "orders"), order);
  }

  // Stats
  await setDoc(doc(db, "stats", "overview"), {
    totalRevenue: 12345,
    totalOrders: 89,
    totalUsers: 234,
    totalProducts: 56,
    revenueData: [
      { month: "Jan", revenue: 4000 },
      { month: "Feb", revenue: 3000 },
      { month: "Mar", revenue: 5000 },
      { month: "Apr", revenue: 4500 },
      { month: "May", revenue: 6000 },
      { month: "Jun", revenue: 5500 },
      { month: "Jul", revenue: 7000 },
      { month: "Aug", revenue: 6500 },
      { month: "Sep", revenue: 8000 },
      { month: "Oct", revenue: 7500 },
      { month: "Nov", revenue: 9000 },
      { month: "Dec", revenue: 12345 },
    ],
    ordersData: [
      { month: "Jan", orders: 10 },
      { month: "Feb", orders: 15 },
      { month: "Mar", orders: 20 },
      { month: "Apr", orders: 18 },
      { month: "May", orders: 25 },
      { month: "Jun", orders: 22 },
      { month: "Jul", orders: 30 },
      { month: "Aug", orders: 28 },
      { month: "Sep", orders: 35 },
      { month: "Oct", orders: 32 },
      { month: "Nov", orders: 40 },
      { month: "Dec", orders: 89 },
    ],
  });

  console.log("✅ Database seeded!");
};