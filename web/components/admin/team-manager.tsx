"use client";

import { useEffect, useState, useCallback } from "react";
import { authClient } from "@/lib/auth-client";

type Member = {
  id: string;
  name: string;
  email: string;
  role?: string | null;
  banned?: boolean | null;
};

export function TeamManager({ currentUserId }: { currentUserId: string }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("editor");
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await authClient.admin.listUsers({
      query: { limit: 100 },
    });
    setLoading(false);
    if (error) {
      setError(error.message || "Could not load team members.");
      return;
    }
    setMembers((data?.users as Member[]) || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    // Better Auth's client types default to "user" | "admin"; our server
    // config uses "editor" | "admin" via defaultRole/adminRoles instead of
    // full access-control statements, so the literal type doesn't match.
    const { error } = await authClient.admin.createUser({
      name,
      email,
      password,
      role: role as unknown as "admin",
    });
    setCreating(false);
    if (error) {
      setError(error.message || "Could not create user.");
      return;
    }
    setName("");
    setEmail("");
    setPassword("");
    setRole("editor");
    load();
  }

  async function onSetRole(userId: string, newRole: string) {
    await authClient.admin.setRole({ userId, role: newRole as unknown as "admin" });
    load();
  }

  async function onToggleBan(member: Member) {
    if (member.banned) {
      await authClient.admin.unbanUser({ userId: member.id });
    } else {
      await authClient.admin.banUser({ userId: member.id });
    }
    load();
  }

  async function onRemove(userId: string) {
    if (!confirm("Remove this team member? This cannot be undone.")) return;
    await authClient.admin.removeUser({ userId });
    load();
  }

  return (
    <>
      <div className="admin-card">
        {loading && <p>Loading…</p>}
        {error && <p className="admin-error">{error}</p>}
        {!loading && (
          <div className="admin-list">
            {members.map((m) => (
              <div className="admin-list-item" key={m.id}>
                <div className="admin-list-item__body">
                  <div className="admin-list-item__title">
                    {m.name || m.email}
                    {m.banned && <span className="admin-badge" style={{ marginLeft: 8 }}>Banned</span>}
                  </div>
                  <div className="admin-list-item__meta">{m.email}</div>
                </div>
                <select
                  value={m.role || "editor"}
                  onChange={(e) => onSetRole(m.id, e.target.value)}
                  disabled={m.id === currentUserId}
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                </select>
                <div className="admin-actions">
                  <button
                    className="admin-btn admin-btn--ghost"
                    type="button"
                    onClick={() => onToggleBan(m)}
                    disabled={m.id === currentUserId}
                  >
                    {m.banned ? "Unban" : "Ban"}
                  </button>
                  <button
                    className="admin-btn admin-btn--danger"
                    type="button"
                    onClick={() => onRemove(m.id)}
                    disabled={m.id === currentUserId}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <h2 style={{ fontSize: 15, marginTop: 32 }}>Add a team member</h2>
      <div className="admin-card">
        <form className="admin-form" onSubmit={onCreate}>
          <div className="admin-form-row">
            <label>
              Name
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="admin-form-row">
            <label>
              Temporary password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </label>
            <label>
              Role
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
              </select>
            </label>
          </div>
          <div className="admin-actions">
            <button className="admin-btn" type="submit" disabled={creating}>
              {creating ? "Adding…" : "Add member"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
