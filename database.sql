CREATE DATABASE IF NOT EXISTS auth_api
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE auth_api;

CREATE TABLE IF NOT EXISTS users (
  id          CHAR(36)      NOT NULL,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(150)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role        ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
