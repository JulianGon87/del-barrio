process.env.JWT_SECRET = 'clave_de_prueba'

const request = require('supertest')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// las consultas se reemplazan para probar las rutas sin tocar la base de datos
jest.mock('../src/consultas')
const consultas = require('../src/consultas')
const app = require('../src/app')

const token = (id) => jwt.sign({ id }, process.env.JWT_SECRET)

const newProduct = {
  title: 'Kuchen de nuez',
  price: 8000,
  category_id: 1,
  contact_phone: '+56 9 1234 5678',
}

beforeEach(() => {
  jest.resetAllMocks()
})

describe('POST /api/login', () => {
  it('devuelve 200 con el token y el usuario si los datos son correctos', async () => {
    consultas.getUserByEmail.mockResolvedValue({
      id: 1,
      name: 'Camila',
      business_name: 'Dulces del Canal',
      email: 'camila@correo.cl',
      password: bcrypt.hashSync('123456', 4),
      avatar_url: null,
    })

    const res = await request(app).post('/api/login').send({ email: 'camila@correo.cl', password: '123456' })

    expect(res.status).toBe(200)
    expect(res.body.user.id).toBe(1)
    expect(res.body.user.password).toBeUndefined()
    expect(jwt.verify(res.body.token, process.env.JWT_SECRET).id).toBe(1)
  })

  it('devuelve 401 si la contraseña es incorrecta', async () => {
    consultas.getUserByEmail.mockResolvedValue({ id: 1, password: bcrypt.hashSync('123456', 4) })

    const res = await request(app).post('/api/login').send({ email: 'camila@correo.cl', password: 'otra' })

    expect(res.status).toBe(401)
  })

  it('devuelve 400 si falta la contraseña', async () => {
    const res = await request(app).post('/api/login').send({ email: 'camila@correo.cl' })

    expect(res.status).toBe(400)
  })
})

describe('POST /api/users', () => {
  const body = { name: 'Luis', business_name: 'Greda Viva', email: 'luis@correo.cl', password: '123456' }

  it('devuelve 201 al registrar un emprendedor', async () => {
    consultas.createUser.mockResolvedValue({ id: 2, ...body, password: undefined })

    const res = await request(app).post('/api/users').send(body)

    expect(res.status).toBe(201)
    expect(res.body.id).toBe(2)
  })

  it('devuelve 400 si falta business_name', async () => {
    const res = await request(app).post('/api/users').send({ ...body, business_name: '' })

    expect(res.status).toBe(400)
  })

  it('devuelve 409 si el email ya está registrado', async () => {
    consultas.createUser.mockRejectedValue(
      Object.assign(new Error('Ese email ya está registrado'), { status: 409 })
    )

    const res = await request(app).post('/api/users').send(body)

    expect(res.status).toBe(409)
    expect(res.body.error).toBe('Ese email ya está registrado')
  })
})

describe('GET /api/products/:id', () => {
  it('devuelve 200 con el detalle y sin el user_id', async () => {
    consultas.getProductById.mockResolvedValue({ id: 5, user_id: 1, title: 'Gorro tejido' })

    const res = await request(app).get('/api/products/5')

    expect(res.status).toBe(200)
    expect(res.body.title).toBe('Gorro tejido')
    expect(res.body.user_id).toBeUndefined()
  })

  it('devuelve 404 si el producto no existe', async () => {
    consultas.getProductById.mockResolvedValue(undefined)

    const res = await request(app).get('/api/products/999')

    expect(res.status).toBe(404)
  })

  it('devuelve 404 si el id no es un número', async () => {
    const res = await request(app).get('/api/products/abc')

    expect(res.status).toBe(404)
    expect(consultas.getProductById).not.toHaveBeenCalled()
  })
})

describe('POST /api/products', () => {
  it('devuelve 401 si no se envía el token', async () => {
    const res = await request(app).post('/api/products').send(newProduct)

    expect(res.status).toBe(401)
  })

  it('devuelve 401 si el token no es válido', async () => {
    const res = await request(app).post('/api/products').set('Authorization', 'Bearer abc').send(newProduct)

    expect(res.status).toBe(401)
  })

  it('devuelve 400 si no viene ningún contacto', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token(1)}`)
      .send({ title: 'Kuchen', price: 8000, category_id: 1 })

    expect(res.status).toBe(400)
  })

  it('devuelve 400 si category_id no es un número entero', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token(1)}`)
      .send({ ...newProduct, category_id: 'abc' })

    expect(res.status).toBe(400)
    expect(consultas.createProduct).not.toHaveBeenCalled()
  })

  it('devuelve 201 y crea el producto a nombre del usuario del token', async () => {
    consultas.createProduct.mockResolvedValue({ id: 10, user_id: 1, ...newProduct })

    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token(1)}`)
      .send(newProduct)

    expect(res.status).toBe(201)
    expect(consultas.createProduct.mock.calls[0][0]).toBe(1)
  })
})

describe('DELETE /api/products/:id', () => {
  it('devuelve 403 si el producto es de otro emprendedor', async () => {
    consultas.getProductById.mockResolvedValue({ id: 3, user_id: 2 })

    const res = await request(app).delete('/api/products/3').set('Authorization', `Bearer ${token(1)}`)

    expect(res.status).toBe(403)
    expect(consultas.deleteProduct).not.toHaveBeenCalled()
  })

  it('devuelve 204 si el producto es del usuario', async () => {
    consultas.getProductById.mockResolvedValue({ id: 3, user_id: 1 })

    const res = await request(app).delete('/api/products/3').set('Authorization', `Bearer ${token(1)}`)

    expect(res.status).toBe(204)
    expect(consultas.deleteProduct).toHaveBeenCalledWith(3)
  })
})

describe('GET /api/users/me', () => {
  it('devuelve 401 sin token', async () => {
    const res = await request(app).get('/api/users/me')

    expect(res.status).toBe(401)
  })

  it('devuelve 200 con los datos del usuario del token', async () => {
    consultas.getUserById.mockResolvedValue({ id: 1, email: 'camila@correo.cl' })

    const res = await request(app).get('/api/users/me').set('Authorization', `Bearer ${token(1)}`)

    expect(res.status).toBe(200)
    expect(res.body.email).toBe('camila@correo.cl')
  })
})
