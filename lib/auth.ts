import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink } from "better-auth/plugins";
import { prisma } from "./prisma";
import { sendEmail, magicLinkEmail, verifyEmail } from "./email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  appName: "Blind Side",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  basePath: "/api/auth",
  secret: process.env.BETTER_AUTH_SECRET,

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "CLIENT",
        input: false,
      },
      orgId: {
        type: "string",
        required: false,
        defaultValue: null,
        input: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: true,
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({ to: user.email, subject: "Verify your Blind Side email", html: verifyEmail(url) });
    },
    sendOnSignUp: false,
    autoSignInAfterVerification: true,
    expiresIn: 3600,
  },

  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendEmail({ to: email, subject: "Your Blind Side sign-in link", html: magicLinkEmail(url) });
      },
      expiresIn: 600,
    }),
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },

  trustedOrigins: [
    "http://localhost:3000",
    process.env.BETTER_AUTH_URL || "",
  ].filter(Boolean),

  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
});

export type Session = typeof auth.$Infer.Session;
