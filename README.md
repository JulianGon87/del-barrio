# Del Barrio

Del Barrio es una vitrina online para los emprendedores del sector Canal Chacao, en Quilpué. La hice porque muchos de ellos hacen cosas increíbles (comida casera, artesanía, plantas, tejidos) pero no tienen un lugar propio donde mostrarlas. Acá pueden publicar sus productos, y los vecinos pueden verlos y contactarlos directamente.

Es mi proyecto final de la carrera Full Stack JavaScript de Desafío Latam.

**Pruébala acá:** https://del-barrio-weld.vercel.app

## Qué se puede hacer

**Sin registrarte** puedes ver todo:
- La galería con todos los productos, que puedes filtrar por tipo (comida, artesanía, plantas, ropa y textiles, hogar u otros), buscar por nombre y ordenar por precio.
- El detalle de cada producto, con los datos de contacto del emprendedor.
- La página de cada emprendedor, con todo lo que tiene publicado.

**Registrándote como emprendedor** puedes además:
- Publicar tus productos, con su precio, una foto (pegas la URL de la imagen) y al menos un dato de contacto: teléfono, correo o red social.
- Ver y eliminar tus publicaciones desde Mi perfil.

No hay carrito ni pagos. Cuando alguien quiere comprar algo, se pone en contacto con el emprendedor y acuerdan la compra por su cuenta.

## Cómo probarla

Puedes crear tu propia cuenta en Regístrate. Si prefieres no hacerlo, entra con alguna de estas cuentas de prueba:

| Cuenta | Email | Contraseña |
|---|---|---|
| Camila Rojas (Dulces del Canal) | camila@correo.cl | 123456 |
| Luis Pérez (Greda Viva) | luis@correo.cl | 123456 |

Son cuentas de prueba compartidas, así que lo que publiques con ellas lo puede ver cualquiera.

## Cómo funciona

- **Frontend:** React con Vite. La navegación usa React Router y el estado de la sesión y de los productos se maneja con Context API. El diseño es con Bootstrap.
- **Backend:** una API REST con Node y Express. Se conecta a PostgreSQL con `pg`, guarda las contraseñas con bcrypt y maneja la sesión con tokens JWT. Las rutas privadas pasan por un middleware que revisa el token.
- **Base de datos:** PostgreSQL en Supabase, con tres tablas: `users` (los emprendedores), `categories` y `products`.
- **Despliegue:** el cliente y la API están en Vercel.

El backend tiene tests con Jest y supertest que prueban las rutas y sus códigos de estado.

## Correrlo en tu computador

Necesitas Node.js y una base de datos PostgreSQL.

**Backend** (carpeta `backend`):

1. Crea una base de datos y corre el archivo `script.sql`, que crea las tablas y las categorías.
2. Copia `.env.example` como `.env` y completa los valores:
   - `DATABASE_URL`: la conexión a tu base de datos.
   - `DB_SSL`: `true` si tu base lo exige, como Supabase, y `false` si es local.
   - `JWT_SECRET`: una clave cualquiera para firmar los tokens.
   - `PORT`: el puerto, por defecto 3000.
3. Instala y levanta el servidor:

```
npm install
npm run dev
```

Para correr los tests: `npm test`.

**Frontend** (carpeta `frontend`):

```
npm install
npm run dev
```

Queda en http://localhost:5173 y busca la API en http://localhost:3000/api. Si tu API está en otra dirección, defínela en la variable `VITE_API_URL`.

---

Proyecto final de Julian Gonzalez Aguilera, Full Stack JavaScript, Desafío Latam.
