import { Button, Form, Input, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'

import { AuthCard } from '../components/AuthCard'
import { useForgotPasswordMutation } from '../store/api'
import { getApiErrorMessage } from '../utils/apiError'

export function ForgotPassword() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()
  const navigate = useNavigate()

  async function onFinish(values: { email: string }) {
    try {
      await forgotPassword(values).unwrap()
      message.success('Reset OTP sent')
      navigate('/reset-password', { state: { email: values.email } })
    } catch (error) {
      message.error(getApiErrorMessage(error, 'Could not send reset OTP'))
    }
  }

  return (
    <AuthCard title="Forgot Password" subtitle="Send a reset OTP to your email.">
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Email" name="email" rules={[{ required: true }, { type: 'email' }]}>
          <Input />
        </Form.Item>
        <Button block type="primary" htmlType="submit" loading={isLoading}>
          Send reset OTP
        </Button>
      </Form>
      <div className="mt-4 text-sm">
        <Link to="/login">Back to login</Link>
      </div>
    </AuthCard>
  )
}
