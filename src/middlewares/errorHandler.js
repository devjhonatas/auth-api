function errorHandler(err, req, res, next) {
  // erros lançados com { status, message } nos services
  if (err.status && err.message) {
    return res.status(err.status).json({ error: err.message });
  }

  // erros inesperados — não vazar detalhes em produção
  console.error("[ERROR]", err);

  const message =
    process.env.NODE_ENV === "production"
      ? "Algo deu errado. Tente novamente mais tarde."
      : err.message;

  return res.status(500).json({ error: message });
}

module.exports = errorHandler;
