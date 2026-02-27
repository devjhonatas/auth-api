# auth-api

API REST de autenticação e gerenciamento de usuários feita com Node.js, Express e MySQL.

## Funcionalidades

- Cadastro de usuário com validação de e-mail e senha
- Login com JWT
- Troca de senha autenticada
- Perfil do usuário logado
- Listagem de usuários (apenas admin)
- Deleção de conta (própria ou por admin)
- Rate limiting no endpoint de login
- Tratamento global de erros

## Estrutura

```
auth-api/
├── src/
│   ├── config/
│   │   └── database.js        # pool de conexão MySQL
│   ├── controllers/
│   │   ├── authController.js  # recebe req, chama service, devolve res
│   │   └── userController.js
│   ├── middlewares/
│   │   ├── auth.js            # verifica JWT e role
│   │   └── errorHandler.js    # captura todos os erros
│   ├── models/
│   │   └── userModel.js       # queries SQL diretas
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── services/
│   │   ├── authService.js     # lógica de negócio de auth
│   │   └── userService.js
│   ├── utils/
│   │   ├── jwt.js             # gerar e verificar tokens
│   │   └── validators.js      # validações sem lib externa
│   ├── app.js                 # configuração do Express
│   └── server.js              # ponto de entrada
├── tests/
│   └── auth.test.js
├── database.sql               # script pra criar o banco
├── .env.example
└── package.json
```

## Como rodar

**1. Clone e instale as dependências**
```bash
npm install
```

**2. Configure as variáveis de ambiente**
```bash
cp .env.example .env
# edite o .env com suas credenciais do MySQL
```

**3. Crie o banco de dados**
```bash
mysql -u root -p < database.sql
```

**4. Inicie o servidor**
```bash
# desenvolvimento (com hot reload)
npm run dev

# produção
npm start
```

**5. Testes**
```bash
npm test
```

## Endpoints

### Autenticação

| Método | Rota | Autenticação | Descrição |
|--------|------|:---:|-----------|
| POST | `/api/auth/register` | — | Cria conta |
| POST | `/api/auth/login` | — | Faz login |
| PATCH | `/api/auth/change-password` | ✓ | Troca senha |

### Usuários

| Método | Rota | Autenticação | Descrição |
|--------|------|:---:|-----------|
| GET | `/api/users/me` | ✓ | Perfil do usuário logado |
| GET | `/api/users` | ✓ admin | Lista todos os usuários |
| DELETE | `/api/users/:id` | ✓ | Deleta conta |

### Exemplos de requisição

**Cadastro**
```json
POST /api/auth/register
{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "password": "minhasenha123"
}
```

**Login**
```json
POST /api/auth/login
{
  "email": "maria@email.com",
  "password": "minhasenha123"
}
```

**Trocar senha** *(Authorization: Bearer {token})*
```json
PATCH /api/auth/change-password
{
  "old_password": "minhasenha123",
  "new_password": "novasenha456"
}
```

## Observações de segurança

- Senhas salvas com bcrypt (custo configurável via `BCRYPT_ROUNDS`)
- JWT com expiração configurável via `JWT_EXPIRES_IN`
- Mensagem de erro genérica no login (não revela se e-mail existe)
- Rate limit de 10 tentativas de login a cada 15 minutos
- Erros internos não expõem stack trace em produção
