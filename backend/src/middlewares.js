const jwt = require('jsonwebtoken')

// pide el header Authorization: Bearer <token> y deja el usuario en req.user
const verifyToken = (req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Falta el token' })

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Token no válido' })
  }
}

const MAX_INT = 2147483647

const hasText =(value) => typeof value === 'string' && value.trim() !== ''

const checkRegisterData = (req, res, next) => {
  const { name, business_name, email, password } = req.body
  if (![name, business_name, email, password].every(hasText)) {
    return res.status(400).json({ error: 'Faltan datos: name, business_name, email y password' })
  }
  next()
}

const checkLoginData = (req, res, next) => {
  const { email, password } = req.body
  if (!hasText(email) || !hasText(password)) {
    return res.status(400).json({ error: 'Falta el email o la contraseña' })
  }
  next()
}

const checkProductData = (req, res, next) => {
  const { title, price, category_id, contact_phone, contact_email, contact_social } = req.body
  if (!hasText(title) || price === undefined || !category_id) {
    return res.status(400).json({ error: 'Faltan datos: title, price y category_id' })
  }
  // los números tienen que caber en un INT de PostgreSQL
  if (!Number.isInteger(price) || price < 0 || price > MAX_INT) {
    return res.status(400).json({ error: 'El precio debe ser un número entero mayor o igual a 0' })
  }
  if (!Number.isInteger(category_id) || category_id < 1 || category_id > MAX_INT) {
    return res.status(400).json({ error: 'category_id debe ser un número entero' })
  }
  if (![contact_phone, contact_email, contact_social].some(hasText)) {
    return res.status(400).json({ error: 'Agrega al menos un dato de contacto' })
  }
  next()
}

module.exports = { verifyToken, checkRegisterData, checkLoginData, checkProductData }
