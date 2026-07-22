import instance from './instance'

export async function listProducts() {
  const { data } = await instance.get('payments/products', { withCredentials: true })
  return data?.products || []
}

export async function checkout(productId) {
  const { data } = await instance.post(
    'payments/checkout',
    { productId },
    { withCredentials: true },
  )
  return data
}

export async function getOrder(orderNumber) {
  const { data } = await instance.get(`payments/orders/${encodeURIComponent(orderNumber)}`, {
    withCredentials: true,
  })
  return data
}
