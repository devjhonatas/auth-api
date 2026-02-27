require("dotenv").config();
const app = require("./app");
const { testConnection } = require("./config/database");

const PORT = process.env.PORT || 3000;

async function start() {
  await testConnection();

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} [${process.env.NODE_ENV}]`);
  });
}

start();
