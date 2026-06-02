import { Card, Descriptions, Skeleton, Tag } from 'antd'

import { PageHeader } from '../components/PageHeader'
import { useMeQuery } from '../store/api'

export function Profile() {
  const { data, isLoading } = useMeQuery()

  if (isLoading) return <Skeleton active />

  return (
    <>
      <PageHeader title="Profile" subtitle="Data from /auth/me." />
      <Card>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{data?.id}</Descriptions.Item>
          <Descriptions.Item label="Username">{data?.username}</Descriptions.Item>
          <Descriptions.Item label="Email">{data?.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{data?.phone || '-'}</Descriptions.Item>
          <Descriptions.Item label="Verified">
            {data?.is_verified ? <Tag color="green">Verified</Tag> : <Tag>Not verified</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label="Admin">
            {data?.is_admin ? <Tag color="blue">Admin</Tag> : <Tag>User</Tag>}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </>
  )
}
