import { Button, Card, Form, Input, InputNumber, message, Select, Table, Tag } from 'antd'

import { PageHeader } from '../components/PageHeader'
import {
  useAddCartMutation,
  useCategoriesQuery,
  useCreateCategoryMutation,
  useCreateProductMutation,
  useMeQuery,
  useProductsQuery,
} from '../store/api'
import type { Product } from '../store/api'

export function Products() {
  const { data: user } = useMeQuery()
  const { data: products = [], isLoading: productsLoading } = useProductsQuery()
  const { data: categories = [], isLoading: categoriesLoading } = useCategoriesQuery()
  const [createCategory, categoryState] = useCreateCategoryMutation()
  const [createProduct, productState] = useCreateProductMutation()
  const [addCart, cartState] = useAddCartMutation()
  const [categoryForm] = Form.useForm()
  const [productForm] = Form.useForm()

  async function submitCategory(values: { name: string; description?: string }) {
    try {
      await createCategory(values).unwrap()
      categoryForm.resetFields()
      message.success('Category created')
    } catch {
      message.error('Category create failed')
    }
  }

  async function submitProduct(values: {
    name: string
    description?: string
    price: number
    stock: number
    image_url?: string
    category_id?: number
  }) {
    try {
      await createProduct({ ...values, price: String(values.price) }).unwrap()
      productForm.resetFields()
      message.success('Product created')
    } catch {
      message.error('Product create failed')
    }
  }

  async function addProductToCart(productId: number) {
    try {
      await addCart({ product_id: productId, quantity: 1 }).unwrap()
      message.success('Added to cart')
    } catch {
      message.error('Could not add to cart')
    }
  }

  return (
    <>
      <PageHeader title="Products" subtitle="Products, categories, create forms, and add-to-cart API data." />
      {user?.is_admin ? (
        <div className="mb-5 grid gap-4 lg:grid-cols-2">
          <Card title="Create category">
            <Form form={categoryForm} layout="vertical" onFinish={submitCategory}>
              <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Description" name="description">
                <Input.TextArea rows={3} />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={categoryState.isLoading}>
                Save category
              </Button>
            </Form>
          </Card>
          <Card title="Create product">
            <Form form={productForm} layout="vertical" onFinish={submitProduct}>
              <div className="grid gap-3 md:grid-cols-2">
                <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Category" name="category_id">
                  <Select
                    allowClear
                    loading={categoriesLoading}
                    options={categories.map((category) => ({ value: category.id, label: category.name }))}
                  />
                </Form.Item>
                <Form.Item label="Price" name="price" rules={[{ required: true }]}>
                  <InputNumber className="w-full" min={1} />
                </Form.Item>
                <Form.Item label="Stock" name="stock" rules={[{ required: true }]}>
                  <InputNumber className="w-full" min={0} />
                </Form.Item>
              </div>
              <Form.Item label="Image URL" name="image_url">
                <Input />
              </Form.Item>
              <Form.Item label="Description" name="description">
                <Input.TextArea rows={3} />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={productState.isLoading}>
                Save product
              </Button>
            </Form>
          </Card>
        </div>
      ) : null}

      <Card title="All products">
        <Table<Product>
          rowKey="id"
          loading={productsLoading}
          dataSource={products}
          scroll={{ x: true }}
          columns={[
            { title: 'Name', dataIndex: 'name' },
            { title: 'Price', dataIndex: 'price', render: (value) => `₹${value}` },
            { title: 'Stock', dataIndex: 'stock' },
            {
              title: 'Category',
              dataIndex: 'category_id',
              render: (id) => categories.find((category) => category.id === id)?.name || '-',
            },
            { title: 'Status', render: (_, row) => (row.stock > 0 ? <Tag color="green">Available</Tag> : <Tag>Out</Tag>) },
            {
              title: 'Action',
              render: (_, row) => (
                <Button disabled={row.stock < 1} loading={cartState.isLoading} onClick={() => addProductToCart(row.id)}>
                  Add to cart
                </Button>
              ),
            },
          ]}
        />
      </Card>
    </>
  )
}
