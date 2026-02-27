const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const userModel = require("../models/userModel");
const { generateToken } = require("../utils/jwt");
const { isValidEmail, isStrongPassword, sanitizeString } = require("../utils/validators");

const ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 10;

async function register(data) {
  const name = sanitizeString(data.name || "");
  const email = sanitizeString(data.email || "").toLowerCase();
  const password = data.password || "";

  if (!name || name.length < 2) {
    throw { status: 400, message: "Nome precisa ter pelo menos 2 caracteres." };
  }

  if (!isValidEmail(email)) {
    throw { status: 400, message: "E-mail inválido." };
  }

  if (!isStrongPassword(password)) {
    throw { status: 400, message: "Senha fraca. Use ao menos 8 caracteres com letras e números." };
  }

  const existing = await userModel.findByEmail(email);
  if (existing) {
    throw { status: 409, message: "Já existe uma conta com esse e-mail." };
  }

  const password_hash = await bcrypt.hash(password, ROUNDS);
  const id = uuidv4();

  const user = await userModel.create({ id, name, email, password_hash, role: "user" });

  const token = generateToken({ id: user.id, role: user.role });

  return { user, token };
}

async function login(email, password) {
  if (!email || !password) {
    throw { status: 400, message: "E-mail e senha são obrigatórios." };
  }

  const user = await userModel.findByEmail(email.toLowerCase());

  // mensagem genérica pra não vazar se o email existe ou não
  if (!user) {
    throw { status: 401, message: "Credenciais inválidas." };
  }

  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) {
    throw { status: 401, message: "Credenciais inválidas." };
  }

  const token = generateToken({ id: user.id, role: user.role });

  const { password_hash, ...safeUser } = user;
  return { user: safeUser, token };
}

async function changePassword(userId, oldPassword, newPassword) {
  const user = await userModel.findByEmail(
    (await userModel.findById(userId))?.email
  );

  if (!user) {
    throw { status: 404, message: "Usuário não encontrado." };
  }

  const match = await bcrypt.compare(oldPassword, user.password_hash);
  if (!match) {
    throw { status: 401, message: "Senha atual incorreta." };
  }

  if (!isStrongPassword(newPassword)) {
    throw { status: 400, message: "Senha fraca. Use ao menos 8 caracteres com letras e números." };
  }

  if (oldPassword === newPassword) {
    throw { status: 400, message: "A nova senha não pode ser igual à atual." };
  }

  const new_hash = await bcrypt.hash(newPassword, ROUNDS);
  await userModel.updatePassword(userId, new_hash);
}

module.exports = { register, login, changePassword };
