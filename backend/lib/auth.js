// Usa 'require' per MySQL2 e Better Auth
const { createPool } = require("mysql2/promise");
const { betterAuth } = require("better-auth");
const { createAuthMiddleware, APIError } = require("better-auth/api");
const dotenv = require('dotenv');
dotenv.config();

// Configura il pool di connessioni MySQL
const dbPool = createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  timezone: 'Z',
});

const auth = betterAuth({
  trustedOrigins: ['http://localhost:5173'],
  database: dbPool,  
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: { type: "number", required: true },
      phone: { type: "string", required: false },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const email = ctx.body?.email;
        if (!email || !email.endsWith("@unibo.it")) {
          throw new APIError("BAD_REQUEST", {
            message: "Registrazione consentita solo con email @unibo.it",
          });
        }
      }
      return undefined;
    }),
  }
});

module.exports = { auth };