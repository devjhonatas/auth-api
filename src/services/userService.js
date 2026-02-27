const userModel = require("../models/userModel");

async function getProfile(userId) {
  const user = await userModel.findById(userId);
  if (!user) {
    throw { status: 404, message: "Usuário não encontrado." };
  }
  return user;
}

async function getAllUsers() {
  return userModel.listAll();
}

async function deleteUser(requesterId, targetId, requesterRole) {
  // usuário comum só pode deletar a si mesmo
  if (requesterRole !== "admin" && requesterId !== targetId) {
    throw { status: 403, message: "Sem permissão para deletar outro usuário." };
  }

  const exists = await userModel.findById(targetId);
  if (!exists) {
    throw { status: 404, message: "Usuário não encontrado." };
  }

  await userModel.remove(targetId);
}

module.exports = { getProfile, getAllUsers, deleteUser };
