import { Navigate, Route, Routes } from 'react-router-dom'

import { ProtectedLayout } from './components/ProtectedLayout'
import { PublicLayout } from './components/PublicLayout'
import { Addresses } from './screens/Addresses'
import { Cart } from './screens/Cart'
import { Dashboard } from './screens/Dashboard'
import { ForgotPassword } from './screens/ForgotPassword'
import { Login } from './screens/Login'
import { Orders } from './screens/Orders'
import { Products } from './screens/Products'
import { Profile } from './screens/Profile'
import { Register } from './screens/Register'
import { ResetPassword } from './screens/ResetPassword'
import { VerifyOtp } from './screens/VerifyOtp'

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/addresses" element={<Addresses />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
