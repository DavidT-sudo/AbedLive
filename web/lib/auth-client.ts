"use client";

import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

// No baseURL: the admin UI and /api/auth always share an origin, so Better
// Auth's client infers it from window.location at runtime. This matters in
// Docker specifically — a NEXT_PUBLIC_* var would get baked in at build
// time, not read from the container's real runtime env, and silently break.
export const authClient = createAuthClient({
  plugins: [adminClient()],
});

export const { useSession, signIn, signOut } = authClient;
