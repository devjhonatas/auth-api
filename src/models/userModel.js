const { pool } = require("../config/database");

async function findByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(
    "SELECT id, name, email, role, created_at FROM users WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] || null;
}

async function create({ id, name, email, password_hash, role }) {
  await pool.query(
    "INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)",
    [id, name, email, password_hash, role]
  );
  return findById(id);
}

async function updatePassword(id, new_hash) {
  await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [new_hash, id]);
}

async function listAll() {
  const [rows] = await pool.query(
    "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
  );
  return rows;
}

async function remove(id) {
  const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = { findByEmail, findById, create, updatePassword, listAll, remove };
