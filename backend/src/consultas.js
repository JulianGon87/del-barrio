const bcrypt = require('bcryptjs')
const pool = require('./db')

// error con código de estado para que lo use el manejador de errores
const fail = (status, message) => Object.assign(new Error(message), { status })

const orders = {
  price_asc: 'p.price ASC',
  price_desc: 'p.price DESC',
}

const productFields = `
  p.id, p.title, p.price, p.image_url,
  json_build_object('id', c.id, 'name', c.name) AS category,
  json_build_object('id', u.id, 'business_name', u.business_name) AS entrepreneur`

const productJoins = `
  FROM products p
  JOIN categories c ON c.id = p.category_id
  JOIN users u ON u.id = p.user_id`

const createUser = async ({ name, business_name, description, email, password, avatar_url }) => {
  const hash = await bcrypt.hash(password, 10)
  try {
    const { rows } = await pool.query(
      `INSERT INTO users (name, business_name, description, email, password, avatar_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, business_name, description, email, avatar_url`,
      [name, business_name, description, email, hash, avatar_url]
    )
    return rows[0]
  } catch (error) {
    if (error.code === '23505') throw fail(409, 'Ese email ya está registrado')
    throw error
  }
}

const getUserByEmail = async (email) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email])
  return rows[0]
}

const getUserById = async (id) => {
  const { rows } = await pool.query(
    'SELECT id, name, business_name, description, email, avatar_url FROM users WHERE id = $1',
    [id]
  )
  return rows[0]
}

const getCategories = async () => {
  const { rows } = await pool.query('SELECT id, name FROM categories ORDER BY id')
  return rows
}

const getProducts = async ({ category, name, order }) => {
  const orderBy = orders[order] || 'p.created_at DESC'
  const { rows } = await pool.query(
    `SELECT ${productFields} ${productJoins}
     WHERE ($1::int IS NULL OR p.category_id = $1)
       AND ($2::text IS NULL OR p.title ILIKE '%' || $2 || '%')
     ORDER BY ${orderBy}`,
    [category || null, name || null]
  )
  return rows
}

const getProductById = async (id) => {
  const { rows } = await pool.query(
    `SELECT p.id, p.user_id, p.title, p.description, p.price, p.image_url, p.created_at,
       p.contact_phone, p.contact_email, p.contact_social,
       json_build_object('id', c.id, 'name', c.name) AS category,
       json_build_object('id', u.id, 'business_name', u.business_name, 'avatar_url', u.avatar_url) AS entrepreneur
     ${productJoins}
     WHERE p.id = $1`,
    [id]
  )
  return rows[0]
}

const getProductsByUser = async (userId) => {
  const { rows } = await pool.query(
    'SELECT id, title, price, image_url FROM products WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  )
  return rows
}

const createProduct = async (userId, data) => {
  const { category_id, title, description, price, image_url, contact_phone, contact_email, contact_social } = data
  try {
    const { rows } = await pool.query(
      `INSERT INTO products
         (user_id, category_id, title, description, price, image_url, contact_phone, contact_email, contact_social)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [userId, category_id, title, description, price, image_url, contact_phone, contact_email, contact_social]
    )
    return rows[0]
  } catch (error) {
    if (error.code === '23503') throw fail(404, 'La categoría no existe')
    throw error
  }
}

const deleteProduct = async (id) => {
  await pool.query('DELETE FROM products WHERE id = $1', [id])
}

const getEntrepreneur = async (id) => {
  const { rows } = await pool.query(
    'SELECT id, business_name, description, avatar_url FROM users WHERE id = $1',
    [id]
  )
  if (!rows[0]) return undefined
  const products = await pool.query(
    `SELECT p.id, p.title, p.price, p.image_url,
       json_build_object('id', c.id, 'name', c.name) AS category
     FROM products p JOIN categories c ON c.id = p.category_id
     WHERE p.user_id = $1
     ORDER BY p.created_at DESC`,
    [id]
  )
  return { ...rows[0], products: products.rows }
}

module.exports = {
  fail,
  createUser,
  getUserByEmail,
  getUserById,
  getCategories,
  getProducts,
  getProductById,
  getProductsByUser,
  createProduct,
  deleteProduct,
  getEntrepreneur,
}
