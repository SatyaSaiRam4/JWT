import { Card, Col, Row, Skeleton, Statistic, Tag } from 'antd'

import { PageHeader } from '../components/PageHeader'
import { useDashboardQuery } from '../store/api'

export function Dashboard() {
  const { data, isLoading } = useDashboardQuery()

  if (isLoading) return <Skeleton active />

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Live counts from your backend dashboard API." />
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={6}>
          <Card><Statistic title="Products" value={data?.counts.products || 0} /></Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card><Statistic title="Categories" value={data?.counts.categories || 0} /></Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card><Statistic title="My cart items" value={data?.counts.my_cart_items || 0} /></Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card><Statistic title="My orders" value={data?.counts.my_orders || 0} /></Card>
        </Col>
        <Col span={24}>
          <Card title="Current user">
            <div className="grid gap-2 md:grid-cols-2">
              <div>Email: {data?.user.email}</div>
              <div>Username: {data?.user.username}</div>
              <div>Verified: {data?.user.is_verified ? <Tag color="green">Yes</Tag> : <Tag>No</Tag>}</div>
              <div>Role: {data?.user.is_admin ? <Tag color="blue">Admin</Tag> : <Tag>User</Tag>}</div>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  )
}
