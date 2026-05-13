import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from './pages/DashBoard'
import Users from "./pages/Users";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
      </Route>
    </Routes>
  );
}

export default App;