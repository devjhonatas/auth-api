function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function isStrongPassword(password) {
  // mínimo 8 chars, pelo menos 1 letra e 1 número
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}

function sanitizeString(str) {
  return str.trim().replace(/\s+/g, " ");
}

module.exports = { isValidEmail, isStrongPassword, sanitizeString };
