const userService = require("../services/userService");

async function getMe(req, res, next) {
  try {
    const user = await userService.getProfile(req.user.id);
    return res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
}

async function getAllUsers(req, res, next) {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    await userService.deleteUser(req.user.id, req.params.id, req.user.role);
    return res.status(200).json({ message: "Usuário removido." });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMe, getAllUsers, deleteUser };
