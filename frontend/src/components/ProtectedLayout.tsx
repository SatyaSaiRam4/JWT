import { Button, Layout, Menu, message } from 'antd'
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { clearToken } from '../store/authSlice'
import { useLogoutMutation, useMeQuery } from '../store/api'
import { useAppDispatch, useAppSelector } from '../store/hooks'

const { Content, Header, Sider } = Layout

const menuItems = [
  { key: '/dashboard', label: <Link to="/dashboard">Dashboard</Link> },
  { key: '/products', label: <Link to="/products">Products</Link> },
  { key: '/cart', label: <Link to="/cart">Cart</Link> },
  { key: '/addresses', label: <Link to="/addresses">Addresses</Link> },
  { key: '/orders', label: <Link to="/orders">Orders</Link> },
  { key: '/profile', label: <Link to="/profile">Profile</Link> },
]

export function ProtectedLayout() {
  const token = useAppSelector((state) => state.auth.token)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [logout, { isLoading }] = useLogoutMutation()
  const { data: user } = useMeQuery(undefined, { skip: !token })

  if (!token) return <Navigate to="/login" replace />

  async function handleLogout() {
    try {
      await logout().unwrap()
      message.success('Logged out successfully')
    } catch {
      message.warning('Local session cleared')
    } finally {
      dispatch(clearToken())
      navigate('/login', { replace: true })
    }
  }

  return (
    <Layout className="min-h-screen">
      <Sider breakpoint="lg" collapsedWidth="0" className="bg-white">
        <div className="px-5 py-4 text-lg font-semibold text-slate-900">E-commerce</div>
        <Menu selectedKeys={[location.pathname]} mode="inline" items={menuItems} />
      </Sider>
      <Layout>
        <Header className="flex items-center justify-between bg-white px-6">
          <div>
            <div className="text-sm text-slate-500">Signed in as</div>
            <div className="font-semibold text-slate-900">{user?.username || 'User'}</div>
          </div>
          <Button loading={isLoading} onClick={handleLogout}>
            Logout
          </Button>
        </Header>
        <Content className="p-4 md:p-6">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
