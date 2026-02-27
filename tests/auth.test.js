const request = require("supertest");
const app = require("../src/app");

// os testes cobrem os cenários mais importantes sem precisar de banco real
// para rodar contra banco real, configure um .env.test

describe("POST /api/auth/register", () => {
  it("deve rejeitar requisição sem body", async () => {
    const res = await request(app).post("/api/auth/register").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("deve rejeitar e-mail inválido", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Teste",
      email: "nao-e-email",
      password: "senha123",
    });
    expect(res.statusCode).toBe(400);
  });

  it("deve rejeitar senha fraca", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Teste",
      email: "teste@email.com",
      password: "1234",
    });
    expect(res.statusCode).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  it("deve rejeitar quando não passa email e senha", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.statusCode).toBe(400);
  });
});

describe("GET /api/users/me", () => {
  it("deve retornar 401 sem token", async () => {
    const res = await request(app).get("/api/users/me");
    expect(res.statusCode).toBe(401);
  });

  it("deve retornar 401 com token inválido", async () => {
    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", "Bearer token.falso.aqui");
    expect(res.statusCode).toBe(401);
  });
});

describe("GET /health", () => {
  it("deve retornar status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});
