-- Del Barrio - Tablas de la base de datos

-- los emprendedores que se registran y publican
CREATE TABLE users (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  description TEXT,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,              -- guardada con bcrypt, no en texto plano
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- los tipos de producto que se usan para filtrar la galería
CREATE TABLE categories (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

INSERT INTO categories (name) VALUES
  ('Comida'), ('Artesanía'), ('Plantas'), ('Ropa y textiles'), ('Hogar'), ('Otros');

CREATE TABLE products (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INT NOT NULL REFERENCES categories(id),
  title TEXT NOT NULL,
  description TEXT,
  price INT NOT NULL CHECK (price >= 0),   -- en pesos chilenos
  image_url TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  contact_social TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- cada producto debe tener al menos una forma de contacto
  CHECK (contact_phone IS NOT NULL OR contact_email IS NOT NULL OR contact_social IS NOT NULL)
);

-- índices para las claves foráneas (la galería filtra por categoría y la página
-- de cada emprendedor busca por user_id)
CREATE INDEX products_user_id_idx ON products (user_id);
CREATE INDEX products_category_id_idx ON products (category_id);
