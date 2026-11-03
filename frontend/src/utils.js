// 8000 -> "$8.000"
export const formatPrice = (price) => `$${Number(price).toLocaleString('es-CL')}`
