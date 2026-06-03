import { Button, Form, Input, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'

import { AuthCard } from '../components/AuthCard'
import { useRegisterMutation } from '../store/api'
import { getApiErrorMessage } from '../utils/apiError'

export function Register() {
  const [register, { isLoading }] = useRegisterMutation()
  const navigate = useNavigate()

  async function onFinish(values: { username: string; email: string; phone?: string; password: string }) {
    try {
      await register(values).unwrap()
      message.success('Account created. You can login now.')
      navigate('/login')
    } catch (error) {
      message.error(getApiErrorMessage(error, 'Registration failed'))
    }
  }

  return (
    <AuthCard title="Register" subtitle="Create your account and verify OTP.">
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Username" name="username" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true }, { type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Phone" name="phone">
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, min: 6 }]}>
          <Input.Password />
        </Form.Item>
        <Button block type="primary" htmlType="submit" loading={isLoading}>
          Register
        </Button>
      </Form>
      <div className="mt-4 text-sm">
        <Link to="/login">Already have an account?</Link>
      </div>
    </AuthCard>
  )
}
