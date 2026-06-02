import { Button, Form, Input, message } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { AuthCard } from '../components/AuthCard'
import { useResetPasswordMutation } from '../store/api'
import { getApiErrorMessage } from '../utils/apiError'

export function ResetPassword() {
  const location = useLocation()
  const navigate = useNavigate()
  const [resetPassword, { isLoading }] = useResetPasswordMutation()
  const initialEmail = (location.state as { email?: string } | null)?.email

  async function onFinish(values: { email: string; otp: string; new_password: string }) {
    try {
      await resetPassword(values).unwrap()
      message.success('Password reset successful')
      navigate('/login')
    } catch (error) {
      message.error(getApiErrorMessage(error, 'Password reset failed'))
    }
  }

  return (
    <AuthCard title="Reset Password" subtitle="Use your OTP to set a new password.">
      <Form layout="vertical" onFinish={onFinish} initialValues={{ email: initialEmail }}>
        <Form.Item label="Email" name="email" rules={[{ required: true }, { type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="OTP" name="otp" rules={[{ required: true }]}>
          <Input maxLength={6} />
        </Form.Item>
        <Form.Item label="New password" name="new_password" rules={[{ required: true, min: 6 }]}>
          <Input.Password />
        </Form.Item>
        <Button block type="primary" htmlType="submit" loading={isLoading}>
          Reset password
        </Button>
      </Form>
      <div className="mt-4 text-sm">
        <Link to="/login">Back to login</Link>
      </div>
    </AuthCard>
  )
}
