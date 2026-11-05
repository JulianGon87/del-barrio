const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const consultas = require('./consultas')
const { verifyToken, checkRegisterData, checkLoginData, checkProductData } = require('./middlewares')

const app = express()
app.use(cors())
app.use(express.json())

// texto sin espacios de más, o null si viene vacío
const clean = (value) => (typeof value === 'string' && value.trim() !== '' ? value.trim() : null)

// los id de la URL tienen que ser números que quepan en un INT
const toId = (value) => (/^\d{1,9}$/.test(value) ? Number(value) : null)

app.post('/api/users', checkRegisterData, async (req, res) => {
  const { name, business_name, description, email, password, avatar_url } = req.body
  const user = await consultas.createUser({
    name: name.trim(),
    business_name: business_name.trim(),
    description: clean(description),
    email: email.trim().toLowerCase(),
    password,
    avatar_url: clean(avatar_url),
  })
  res.status(201).json(user)
})

app.post('/api/login', checkLoginData, async (req, res) => {
  const { email, password } = req.body
  const user = await consultas.getUserByEmail(email.trim().toLowerCase())
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Email o contraseña incorrectos' })
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' })
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      business_name: user.business_name,
      email: user.email,
      avatar_url: user.avatar_url,
    },
  })
})

app.get('/api/users/me', verifyToken, async (req, res) => {
  const user = await consultas.getUserById(req.user.id)
  if (!user) return res.status(401).json({ error: 'El usuario ya no existe' })
  res.json(user)
})

app.get('/api/users/me/products', verifyToken, async (req, res) => {
  res.json(await consultas.getProductsByUser(req.user.id))
})

app.get('/api/categories', async (req, res) => {
  res.json(await consultas.getCategories())
})

app.get('/api/products', async (req, res) => {
  const { category, name, order } = req.query
  res.json(await consultas.getProducts({ category: toId(category), name: clean(name), order }))
})

app.get('/api/products/:id', async (req, res) => {
  const id = toId(req.params.id)
  const product = id && (await consultas.getProductById(id))
  if (!product) return res.status(404).json({ error: 'El producto no existe' })

  const { user_id, ...data } = product
  res.json(data)
})

app.post('/api/products', verifyToken, checkProductData, async (req, res) => {
  const { title, description, price, category_id, image_url, contact_phone, contact_email, contact_social } = req.body
  const product = await consultas.createProduct(req.user.id, {
    category_id,
    title: title.trim(),
    description: clean(description),
    price,
    image_url: clean(image_url),
    contact_phone: clean(contact_phone),
    contact_email: clean(contact_email),
    contact_social: clean(contact_social),
  })
  res.status(201).json(product)
})

app.delete('/api/products/:id', verifyToken, async (req, res) => {
  const id = toId(req.params.id)
  const product = id && (await consultas.getProductById(id))
  if (!product) return res.status(404).json({ error: 'El producto no existe' })
  if (product.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Solo puedes eliminar tus propios productos' })
  }

  await consultas.deleteProduct(id)
  res.sendStatus(204)
})

app.get('/api/entrepreneurs/:id', async (req, res) => {
  const id = toId(req.params.id)
  const entrepreneur = id && (await consultas.getEntrepreneur(id))
  if (!entrepreneur) return res.status(404).json({ error: 'El emprendedor no existe' })
  res.json(entrepreneur)
})

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// Express 5 manda aquí los errores de las rutas async
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El JSON enviado no es válido' })
  }
  if (!err.status) console.error(err)
  res.status(err.status || 500).json({ error: err.status ? err.message : 'Error del servidor' })
})

module.exports = app
