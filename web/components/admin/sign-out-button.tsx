"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await authClient.signOut();
        router.push("/admin/login");
        router.refresh();
      }}
    >
      <button type="submit">Sign out</button>
    </form>
  );
}
