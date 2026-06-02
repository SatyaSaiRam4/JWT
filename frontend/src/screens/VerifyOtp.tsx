import { Button, Form, Input, message } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { AuthCard } from '../components/AuthCard'
import { useSendOtpMutation, useVerifyOtpMutation } from '../store/api'
import { getApiErrorMessage } from '../utils/apiError'

export function VerifyOtp() {
  const location = useLocation()
  const navigate = useNavigate()
  const [verifyOtp, verifyState] = useVerifyOtpMutation()
  const [sendOtp, sendState] = useSendOtpMutation()
  const initialEmail = (location.state as { email?: string } | null)?.email

  async function onFinish(values: { email: string; otp: string }) {
    try {
      await verifyOtp(values).unwrap()
      message.success('Email verified. Login now.')
      navigate('/login')
    } catch (error) {
      message.error(getApiErrorMessage(error, 'OTP verification failed'))
    }
  }

  async function resend(email?: string) {
    if (!email) {
      message.warning('Enter email first')
      return
    }
    try {
      await sendOtp({ email }).unwrap()
      message.success('OTP sent again')
    } catch (error) {
      message.error(getApiErrorMessage(error, 'Could not send OTP'))
    }
  }

  return (
    <AuthCard title="Verify OTP" subtitle="Confirm your email before login.">
      <Form layout="vertical" onFinish={onFinish} initialValues={{ email: initialEmail }}>
        <Form.Item label="Email" name="email" rules={[{ required: true }, { type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="OTP" name="otp" rules={[{ required: true }]}>
          <Input maxLength={6} />
        </Form.Item>
        <Button block type="primary" htmlType="submit" loading={verifyState.isLoading}>
          Verify
        </Button>
        <Form.Item shouldUpdate className="mb-0 mt-3">
          {({ getFieldValue }) => (
            <Button block loading={sendState.isLoading} onClick={() => resend(getFieldValue('email'))}>
              Resend OTP
            </Button>
          )}
        </Form.Item>
      </Form>
      <div className="mt-4 text-sm">
        <Link to="/login">Back to login</Link>
      </div>
    </AuthCard>
  )
}
