import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { RootState } from './store'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export type User = {
  id: number
  username: string
  email: string
  phone?: string | null
  is_verified: boolean
  is_admin: boolean
}

export type Category = {
  id: number
  name: string
  description?: string | null
}

export type Product = {
  id: number
  name: string
  description?: string | null
  price: string
  stock: number
  image_url?: string | null
  category_id?: number | null
}

export type Address = {
  id: number
  full_name: string
  phone: string
  address_line: string
  city: string
  state: string
  pincode: string
}

export type CartItem = {
  id: number
  product_id: number
  quantity: number
  product: Product
}

export type OrderItem = {
  id: number
  product_id: number
  quantity: number
  price: string
}

export type Order = {
  id: number
  status: string
  total_amount: string
  items: OrderItem[]
}

export type DashboardSummary = {
  user: User
  counts: {
    products: number
    categories: number
    my_cart_items: number
    my_orders: number
  }
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Me', 'Dashboard', 'Products', 'Categories', 'Cart', 'Addresses', 'Orders'],
  endpoints: (builder) => ({
    register: builder.mutation<User, { username: string; email: string; password: string; phone?: string }>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),
    login: builder.mutation<{ access_token: string; token_type: string }, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      invalidatesTags: ['Me', 'Dashboard'],
    }),
    sendOtp: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({ url: '/auth/send-otp', method: 'POST', body }),
    }),
    verifyOtp: builder.mutation<{ message: string }, { email: string; otp: string }>({
      query: (body) => ({ url: '/auth/verify-otp', method: 'POST', body }),
    }),
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({ url: '/auth/forgot-password', method: 'POST', body }),
    }),
    resetPassword: builder.mutation<{ message: string }, { email: string; otp: string; new_password: string }>({
      query: (body) => ({ url: '/auth/reset-password', method: 'POST', body }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      invalidatesTags: ['Me', 'Dashboard', 'Cart', 'Addresses', 'Orders'],
    }),
    me: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['Me'],
    }),
    dashboard: builder.query<DashboardSummary, void>({
      query: () => '/dashboard/summary',
      providesTags: ['Dashboard'],
    }),
    categories: builder.query<Category[], void>({
      query: () => '/shop/categories',
      providesTags: ['Categories'],
    }),
    createCategory: builder.mutation<Category, { name: string; description?: string }>({
      query: (body) => ({ url: '/shop/categories', method: 'POST', body }),
      invalidatesTags: ['Categories', 'Dashboard'],
    }),
    products: builder.query<Product[], void>({
      query: () => '/shop/products',
      providesTags: ['Products'],
    }),
    product: builder.query<Product, number>({
      query: (id) => `/shop/products/${id}`,
    }),
    createProduct: builder.mutation<Product, Omit<Product, 'id'>>({
      query: (body) => ({ url: '/shop/products', method: 'POST', body }),
      invalidatesTags: ['Products', 'Dashboard'],
    }),
    addresses: builder.query<Address[], void>({
      query: () => '/shop/addresses',
      providesTags: ['Addresses'],
    }),
    createAddress: builder.mutation<Address, Omit<Address, 'id'>>({
      query: (body) => ({ url: '/shop/addresses', method: 'POST', body }),
      invalidatesTags: ['Addresses'],
    }),
    cart: builder.query<CartItem[], void>({
      query: () => '/shop/cart',
      providesTags: ['Cart'],
    }),
    addCart: builder.mutation<CartItem, { product_id: number; quantity: number }>({
      query: (body) => ({ url: '/shop/cart', method: 'POST', body }),
      invalidatesTags: ['Cart', 'Dashboard'],
    }),
    removeCart: builder.mutation<{ message: string }, number>({
      query: (id) => ({ url: `/shop/cart/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Cart', 'Dashboard'],
    }),
    orders: builder.query<Order[], void>({
      query: () => '/shop/orders',
      providesTags: ['Orders'],
    }),
    placeOrder: builder.mutation<Order, { address_id?: number | null }>({
      query: (body) => ({ url: '/shop/orders', method: 'POST', body }),
      invalidatesTags: ['Orders', 'Cart', 'Products', 'Dashboard'],
    }),
  }),
})

export const {
  useAddCartMutation,
  useAddressesQuery,
  useCartQuery,
  useCategoriesQuery,
  useCreateAddressMutation,
  useCreateCategoryMutation,
  useCreateProductMutation,
  useDashboardQuery,
  useForgotPasswordMutation,
  useLoginMutation,
  useLogoutMutation,
  useMeQuery,
  useOrdersQuery,
  usePlaceOrderMutation,
  useProductQuery,
  useProductsQuery,
  useRegisterMutation,
  useRemoveCartMutation,
  useResetPasswordMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} = api
