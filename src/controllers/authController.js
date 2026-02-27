const authService = require("../services/authService");

async function register(req, res, next) {
  try {
    const { user, token } = await authService.register(req.body);
    return res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function changePassword(req, res, next) {
  try {
    const { old_password, new_password } = req.body;

    if (!old_password || !new_password) {
      return res.status(400).json({ error: "old_password e new_password são obrigatórios." });
    }

    await authService.changePassword(req.user.id, old_password, new_password);
    return res.status(200).json({ message: "Senha atualizada com sucesso." });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, changePassword };
