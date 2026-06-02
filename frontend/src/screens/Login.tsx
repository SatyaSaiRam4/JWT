import { Button, Form, Input, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'

import { AuthCard } from '../components/AuthCard'
import { setToken } from '../store/authSlice'
import { useLoginMutation } from '../store/api'
import { useAppDispatch } from '../store/hooks'
import { getApiErrorMessage } from '../utils/apiError'

export function Login() {
  const [login, { isLoading }] = useLoginMutation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  async function onFinish(values: { email: string; password: string }) {
    try {
      const result = await login(values).unwrap()
      dispatch(setToken(result.access_token))
      message.success('Login successful')
      navigate('/dashboard')
    } catch (error) {
      message.error(getApiErrorMessage(error, 'Login failed. Verify your email and credentials.'))
    }
  }

  return (
    <AuthCard title="Login" subtitle="Access your e-commerce dashboard.">
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Email" name="email" rules={[{ required: true }, { type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Button block type="primary" htmlType="submit" loading={isLoading}>
          Login
        </Button>
      </Form>
      <div className="mt-4 flex justify-between text-sm">
        <Link to="/register">Create account</Link>
        <Link to="/forgot-password">Forgot password?</Link>
      </div>
    </AuthCard>
  )
}
