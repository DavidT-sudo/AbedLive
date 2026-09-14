import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin as adminPlugin } from "better-auth/plugins/admin";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    // Editors are added by an existing admin from /admin/team — there is no
    // public sign-up page for this brand site.
    disableSignUp: true,
  },
  plugins: [
    adminPlugin({
      defaultRole: "editor",
      adminRoles: ["admin"],
    }),
    // Must be last so Server Actions can set auth cookies directly.
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
