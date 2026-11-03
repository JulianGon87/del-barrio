// Mientras no exista el backend (Hito 3) los datos se guardan en localStorage.
// Cada función devuelve lo mismo que el contrato de la API del Hito 1, así que
// cuando el backend esté listo solo hay que cambiar este archivo por llamadas fetch.

const DB_KEY = 'del-barrio-db'

const categories = [
  { id: 1, name: 'Comida' },
  { id: 2, name: 'Artesanía' },
  { id: 3, name: 'Plantas' },
  { id: 4, name: 'Ropa y textiles' },
  { id: 5, name: 'Hogar' },
  { id: 6, name: 'Otros' },
]

const foto = (texto, color) =>
  `https://placehold.co/600x400/${color}/333333?text=${texto.replace(/ /g, '+')}`

const seed = {
  users: [
    { id: 1, name: 'Camila Rojas', business_name: 'Dulces del Canal', description: 'Mermeladas y repostería casera hecha en el sector Canal Chacao.', email: 'camila@correo.cl', password: '123456', avatar_url: '' },
    { id: 2, name: 'Luis Pérez', business_name: 'Greda Viva', description: 'Maceteros y piezas de greda hechas a mano en Quilpué.', email: 'luis@correo.cl', password: '123456', avatar_url: '' },
    { id: 3, name: 'Ana Muñoz', business_name: 'Vivero Los Aromos', description: 'Suculentas, hierbas y plantas de interior.', email: 'ana@correo.cl', password: '123456', avatar_url: '' },
    { id: 4, name: 'Rosa Torres', business_name: 'Tejidos Mari', description: 'Tejidos a palillo y crochet para toda la familia.', email: 'rosa@correo.cl', password: '123456', avatar_url: '' },
    { id: 5, name: 'Pedro Soto', business_name: 'Panes de Chacao', description: 'Pan de masa madre y amasado, horneado cada mañana.', email: 'pedro@correo.cl', password: '123456', avatar_url: '' },
  ],
  products: [
    { id: 1, user_id: 1, category_id: 1, title: 'Kuchen de nuez', description: 'Kuchen hecho en casa con nueces, para 8 porciones. Se retira en el sector o se acuerda entrega.', price: 8000, image_url: foto('Kuchen de nuez', 'f5e6c8'), contact_phone: '+56 9 1234 5678', contact_email: 'camila@correo.cl', contact_social: '@dulcesdelcanal' },
    { id: 2, user_id: 2, category_id: 5, title: 'Macetero de greda', description: 'Macetero mediano con desagüe, cada pieza es única.', price: 5500, image_url: foto('Macetero de greda', 'e8c9a8'), contact_phone: '+56 9 2345 6789', contact_email: null, contact_social: null },
    { id: 3, user_id: 1, category_id: 1, title: 'Mermelada de mora', description: 'Frasco de 350 g, sin conservantes.', price: 3000, image_url: foto('Mermelada de mora', 'd9c2e0'), contact_phone: null, contact_email: 'camila@correo.cl', contact_social: '@dulcesdelcanal' },
    { id: 4, user_id: 3, category_id: 3, title: 'Suculentas', description: 'Pack de 3 suculentas en maceta chica.', price: 2500, image_url: foto('Suculentas', 'c8e6c9'), contact_phone: null, contact_email: null, contact_social: '@viveroaromos' },
    { id: 5, user_id: 4, category_id: 4, title: 'Gorro tejido', description: 'Gorro de lana tejido a palillo, varios colores.', price: 12000, image_url: foto('Gorro tejido', 'ffd9b3'), contact_phone: '+56 9 3456 7890', contact_email: null, contact_social: null },
    { id: 6, user_id: 5, category_id: 1, title: 'Pan de masa madre', description: 'Hogaza de 800 g, hecha por encargo con un día de anticipación.', price: 4000, image_url: foto('Pan de masa madre', 'f3e0b5'), contact_phone: '+56 9 4567 8901', contact_email: null, contact_social: '@panesdechacao' },
    { id: 7, user_id: 1, category_id: 1, title: 'Galletas de avena', description: 'Bolsa con 12 galletas de avena y pasas.', price: 2500, image_url: foto('Galletas de avena', 'efd9ae'), contact_phone: '+56 9 1234 5678', contact_email: null, contact_social: null },
    { id: 8, user_id: 4, category_id: 4, title: 'Bufanda de lana', description: 'Bufanda larga tejida a crochet.', price: 9000, image_url: foto('Bufanda de lana', 'ffcdd2'), contact_phone: '+56 9 3456 7890', contact_email: null, contact_social: null },
    { id: 9, user_id: 2, category_id: 2, title: 'Fuente de greda', description: 'Fuente para servir, apta para horno.', price: 14000, image_url: foto('Fuente de greda', 'e0c3a3'), contact_phone: '+56 9 2345 6789', contact_email: null, contact_social: null },
  ],
}

function loadDb() {
  const saved = localStorage.getItem(DB_KEY)
  if (saved) return JSON.parse(saved)
  saveDb(seed)
  return JSON.parse(JSON.stringify(seed))
}

function saveDb(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db))
}

function fail(status, message) {
  const error = new Error(message)
  error.status = status
  throw error
}

// el token de prueba tiene la forma "token-<id>"
function userFromToken(db, token) {
  const id = Number(String(token || '').replace('token-', ''))
  const user = db.users.find((u) => u.id === id)
  if (!user) fail(401, 'Debes iniciar sesión')
  return user
}

const clean = (value) => (value && String(value).trim()) || null

function publicUser(u) {
  return { id: u.id, name: u.name, business_name: u.business_name, description: u.description, email: u.email, avatar_url: u.avatar_url }
}

function cardOf(db, p) {
  const author = db.users.find((u) => u.id === p.user_id)
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    image_url: p.image_url,
    category: categories.find((c) => c.id === p.category_id),
    entrepreneur: { id: author.id, business_name: author.business_name },
  }
}

// POST /api/users
export async function register(data) {
  const db = loadDb()
  const { name, business_name, description, email, password, avatar_url } = data
  if (!clean(name) || !clean(business_name) || !clean(email) || !clean(password)) {
    fail(400, 'Faltan datos obligatorios')
  }
  if (db.users.some((u) => u.email === email.trim())) fail(409, 'Ese email ya está registrado')
  const user = {
    id: Math.max(0, ...db.users.map((u) => u.id)) + 1,
    name: name.trim(),
    business_name: business_name.trim(),
    description: clean(description),
    email: email.trim(),
    password,
    avatar_url: clean(avatar_url),
  }
  db.users.push(user)
  saveDb(db)
  return publicUser(user)
}

// POST /api/login
export async function login(email, password) {
  const db = loadDb()
  if (!email || !password) fail(400, 'Ingresa tu email y tu contraseña')
  const user = db.users.find((u) => u.email === email.trim() && u.password === password)
  if (!user) fail(401, 'Email o contraseña incorrectos')
  return { token: `token-${user.id}`, user: publicUser(user) }
}

// GET /api/categories
export async function getCategories() {
  return categories
}

// GET /api/products?category=&name=&order=
export async function getProducts({ category, name, order } = {}) {
  const db = loadDb()
  let list = db.products.filter((p) => {
    if (category && p.category_id !== Number(category)) return false
    if (name && !p.title.toLowerCase().includes(name.trim().toLowerCase())) return false
    return true
  })
  if (order === 'price_asc') list.sort((a, b) => a.price - b.price)
  else if (order === 'price_desc') list.sort((a, b) => b.price - a.price)
  else list.sort((a, b) => b.id - a.id)
  return list.map((p) => cardOf(db, p))
}

// GET /api/products/:id
export async function getProduct(id) {
  const db = loadDb()
  const p = db.products.find((x) => x.id === Number(id))
  if (!p) fail(404, 'El producto no existe')
  const author = db.users.find((u) => u.id === p.user_id)
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    price: p.price,
    image_url: p.image_url,
    contact_phone: p.contact_phone,
    contact_email: p.contact_email,
    contact_social: p.contact_social,
    category: categories.find((c) => c.id === p.category_id),
    entrepreneur: { id: author.id, business_name: author.business_name, avatar_url: author.avatar_url },
  }
}

// GET /api/entrepreneurs/:id
export async function getEntrepreneur(id) {
  const db = loadDb()
  const u = db.users.find((x) => x.id === Number(id))
  if (!u) fail(404, 'El emprendedor no existe')
  return {
    id: u.id,
    business_name: u.business_name,
    description: u.description,
    avatar_url: u.avatar_url,
    products: db.products.filter((p) => p.user_id === u.id).map((p) => cardOf(db, p)),
  }
}

// GET /api/users/me
export async function getMe(token) {
  return publicUser(userFromToken(loadDb(), token))
}

// GET /api/users/me/products
export async function getMyProducts(token) {
  const db = loadDb()
  const user = userFromToken(db, token)
  return db.products
    .filter((p) => p.user_id === user.id)
    .map((p) => ({ id: p.id, title: p.title, price: p.price, image_url: p.image_url }))
}

// POST /api/products
export async function createProduct(token, data) {
  const db = loadDb()
  const user = userFromToken(db, token)
  const price = Number(data.price)
  const contact = [clean(data.contact_phone), clean(data.contact_email), clean(data.contact_social)]
  if (!clean(data.title) || data.price === '' || !data.category_id) fail(400, 'Faltan datos obligatorios')
  if (Number.isNaN(price) || price < 0) fail(400, 'El precio no es válido')
  if (!contact.some(Boolean)) fail(400, 'Agrega al menos un dato de contacto')
  if (!categories.some((c) => c.id === Number(data.category_id))) fail(404, 'La categoría no existe')
  const product = {
    id: Math.max(0, ...db.products.map((p) => p.id)) + 1,
    user_id: user.id,
    category_id: Number(data.category_id),
    title: data.title.trim(),
    description: clean(data.description),
    price,
    image_url: clean(data.image_url),
    contact_phone: contact[0],
    contact_email: contact[1],
    contact_social: contact[2],
  }
  db.products.push(product)
  saveDb(db)
  return product
}

// DELETE /api/products/:id
export async function deleteProduct(token, id) {
  const db = loadDb()
  const user = userFromToken(db, token)
  const p = db.products.find((x) => x.id === Number(id))
  if (!p) fail(404, 'El producto no existe')
  if (p.user_id !== user.id) fail(403, 'Solo puedes eliminar tus productos')
  db.products = db.products.filter((x) => x.id !== p.id)
  saveDb(db)
}
