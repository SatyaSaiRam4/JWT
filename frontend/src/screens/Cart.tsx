import { useState } from 'react'
import { Button, Card, InputNumber, message, Select, Table } from 'antd'

import { PageHeader } from '../components/PageHeader'
import {
  useAddressesQuery,
  useCartQuery,
  usePlaceOrderMutation,
  useRemoveCartMutation,
} from '../store/api'
import type { CartItem } from '../store/api'

export function Cart() {
  const { data: cart = [], isLoading } = useCartQuery()
  const { data: addresses = [] } = useAddressesQuery()
  const [removeCart, removeState] = useRemoveCartMutation()
  const [placeOrder, orderState] = usePlaceOrderMutation()
  const [selectedAddressId, setSelectedAddressId] = useState<number | undefined>()
  const total = cart.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0)

  async function removeItem(id: number) {
    try {
      await removeCart(id).unwrap()
      message.success('Removed from cart')
    } catch {
      message.error('Could not remove item')
    }
  }

  async function checkout() {
    try {
      await placeOrder({ address_id: selectedAddressId || null }).unwrap()
      message.success('Order placed')
    } catch {
      message.error('Could not place order')
    }
  }

  return (
    <>
      <PageHeader title="Cart" subtitle="Cart data from /shop/cart and checkout through /shop/orders." />
      <Card
        title="My cart"
        extra={<strong>Total: ₹{total.toFixed(2)}</strong>}
      >
        <Table<CartItem>
          rowKey="id"
          loading={isLoading}
          dataSource={cart}
          scroll={{ x: true }}
          columns={[
            { title: 'Product', render: (_, row) => row.product.name },
            { title: 'Price', render: (_, row) => `₹${row.product.price}` },
            { title: 'Quantity', dataIndex: 'quantity', render: (value) => <InputNumber value={value} disabled /> },
            { title: 'Line total', render: (_, row) => `₹${(Number(row.product.price) * row.quantity).toFixed(2)}` },
            {
              title: 'Action',
              render: (_, row) => (
                <Button danger loading={removeState.isLoading} onClick={() => removeItem(row.id)}>
                  Remove
                </Button>
              ),
            },
          ]}
        />
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
          <Select
            allowClear
            className="w-full md:w-80"
            placeholder="Select address"
            options={addresses.map((address) => ({
              value: address.id,
              label: `${address.full_name}, ${address.city}`,
            }))}
            onChange={(value) => {
              setSelectedAddressId(value)
            }}
          />
          <Button type="primary" disabled={!cart.length} loading={orderState.isLoading} onClick={checkout}>
            Place order
          </Button>
        </div>
      </Card>
    </>
  )
}
