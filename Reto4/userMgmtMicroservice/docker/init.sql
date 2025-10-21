-- Inicialización de base de datos y usuario para UserMgmtMicroservice
DO $$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles WHERE rolname = 'ms_user'
   ) THEN
      CREATE ROLE ms_user LOGIN PASSWORD 'ms_password';
   END IF;
END
$$;

CREATE DATABASE microservice_db OWNER ms_user;

GRANT ALL PRIVILEGES ON DATABASE microservice_db TO ms_user;

\connect microservice_db

GRANT ALL ON SCHEMA public TO ms_user;


