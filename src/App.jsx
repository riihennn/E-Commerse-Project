import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRouter.jsx';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const AllProducts = lazy(() => import('./pages/AllProducts'));
const Wishlist = lazy(() => import('./pages/WishList'));
const Cart = lazy(() => import('./pages/Cart'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const Signup = lazy(() => import('./pages/Authentication/Singup'));
const Login = lazy(() => import('./pages/Authentication/Login'));
const Auth = lazy(() => import('./pages/Authentication/Auth'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const Payment = lazy(() => import('./pages/Payment.jsx'));
const Orders = lazy(() => import("./pages/Orders.jsx"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Admin = lazy(() => import('./Admin/Admin.jsx'));

// Layout that includes the navbar
function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet /> {/* renders the nested route */}
    </>
  );
}

// Layout without navbar (for admin)
function AdminLayout() {
  return <Outlet />;
}

function App() {
  return (
    <Router>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      }>
        <Routes>

          {/* ---------- Main layout with Navbar ---------- */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/products" element={<AllProducts />} />
            <Route path="/cart" element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }/>
            <Route path="/wishlist" element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }/>
            <Route path="/productpage/:id" element={<ProductPage />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>

          {/* ---------- Admin layout (no Navbar) ---------- */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }/>
          </Route>

        </Routes>
      </Suspense>
    </Router>
  )
}

export default App;
