import { Card, Table, Tag } from 'antd'

import { PageHeader } from '../components/PageHeader'
import { useOrdersQuery } from '../store/api'
import type { Order } from '../store/api'

export function Orders() {
  const { data: orders = [], isLoading } = useOrdersQuery()

  return (
    <>
      <PageHeader title="Orders" subtitle="Order history from /shop/orders." />
      <Card title="My orders">
        <Table<Order>
          rowKey="id"
          loading={isLoading}
          dataSource={orders}
          expandable={{
            expandedRowRender: (order) => (
              <Table
                rowKey="id"
                pagination={false}
                dataSource={order.items}
                columns={[
                  { title: 'Product ID', dataIndex: 'product_id' },
                  { title: 'Quantity', dataIndex: 'quantity' },
                  { title: 'Price', dataIndex: 'price', render: (value) => `₹${value}` },
                ]}
              />
            ),
          }}
          columns={[
            { title: 'Order ID', dataIndex: 'id' },
            { title: 'Status', dataIndex: 'status', render: (value) => <Tag color="blue">{value}</Tag> },
            { title: 'Total', dataIndex: 'total_amount', render: (value) => `₹${value}` },
            { title: 'Items', render: (_, row) => row.items.length },
          ]}
        />
      </Card>
    </>
  )
}
