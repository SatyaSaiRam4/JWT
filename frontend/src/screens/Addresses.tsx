import { Button, Card, Form, Input, message, Table } from 'antd'

import { PageHeader } from '../components/PageHeader'
import { useAddressesQuery, useCreateAddressMutation } from '../store/api'
import type { Address } from '../store/api'

export function Addresses() {
  const { data: addresses = [], isLoading } = useAddressesQuery()
  const [createAddress, createState] = useCreateAddressMutation()
  const [form] = Form.useForm()

  async function onFinish(values: Omit<Address, 'id'>) {
    try {
      await createAddress(values).unwrap()
      form.resetFields()
      message.success('Address saved')
    } catch {
      message.error('Could not save address')
    }
  }

  return (
    <>
      <PageHeader title="Addresses" subtitle="Create and view addresses from /shop/addresses." />
      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        <Card title="Add address">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item label="Full name" name="full_name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Address line" name="address_line" rules={[{ required: true }]}>
              <Input.TextArea rows={3} />
            </Form.Item>
            <div className="grid gap-3 md:grid-cols-3">
              <Form.Item label="City" name="city" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="State" name="state" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Pincode" name="pincode" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </div>
            <Button type="primary" htmlType="submit" loading={createState.isLoading}>
              Save address
            </Button>
          </Form>
        </Card>
        <Card title="My addresses">
          <Table<Address>
            rowKey="id"
            loading={isLoading}
            dataSource={addresses}
            scroll={{ x: true }}
            columns={[
              { title: 'Name', dataIndex: 'full_name' },
              { title: 'Phone', dataIndex: 'phone' },
              { title: 'Address', dataIndex: 'address_line' },
              { title: 'City', dataIndex: 'city' },
              { title: 'State', dataIndex: 'state' },
              { title: 'Pincode', dataIndex: 'pincode' },
            ]}
          />
        </Card>
      </div>
    </>
  )
}
