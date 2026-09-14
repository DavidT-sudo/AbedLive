import { getSiteSettings } from "@/lib/content";
import { updateSettings } from "./actions";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <h1>Settings &amp; theme</h1>
      <p className="admin-subtitle">Site-wide options.</p>
      <div className="admin-card">
        <form className="admin-form" action={updateSettings}>
          <label>
            Site title
            <input name="siteTitle" defaultValue={settings?.siteTitle} />
          </label>
          <label>
            Design direction
            <select name="theme" defaultValue={settings?.theme || "press"}>
              <option value="press">Press Sheet</option>
              <option value="open-sky">Open Sky</option>
            </select>
          </label>
          <div className="admin-actions">
            <button className="admin-btn" type="submit">Save</button>
          </div>
        </form>
      </div>
    </>
  );
}
