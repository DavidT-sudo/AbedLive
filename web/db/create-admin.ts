import "dotenv/config";
import { auth } from "../lib/auth";

/**
 * Bootstraps the first admin account. Only needed once — after that, admins
 * add teammates from /admin/team. Usage:
 *   npm run admin:create -- --email you@example.com --password "..." --name "Abed"
 */
async function main() {
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const i = args.indexOf(flag);
    return i === -1 ? undefined : args[i + 1];
  };

  const email = get("--email");
  const password = get("--password");
  const name = get("--name") || "Admin";

  if (!email || !password) {
    console.error(
      'Usage: npm run admin:create -- --email you@example.com --password "..." --name "Your Name"'
    );
    process.exit(1);
  }

  const result = await auth.api.createUser({
    body: { email, password, name, role: "admin" },
  });

  console.log(`Created admin user: ${result.user.email} (${result.user.id})`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
