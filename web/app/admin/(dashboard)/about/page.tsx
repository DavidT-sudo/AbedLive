import { getAbout } from "@/lib/content";
import { updateAbout } from "./actions";

export default async function AdminAboutPage() {
  const about = await getAbout();

  return (
    <>
      <h1>About</h1>
      <p className="admin-subtitle">The bio section, facts, and belief quote.</p>
      <div className="admin-card">
        <form className="admin-form" action={updateAbout}>
          <div className="admin-form-row">
            <label>
              Born on
              <input name="bornOn" defaultValue={about?.bornOn} />
            </label>
            <label>
              Based in
              <input name="basedIn" defaultValue={about?.basedIn} />
            </label>
          </div>
          <div className="admin-form-row">
            <label>
              Role
              <input name="role" defaultValue={about?.role} />
            </label>
            <label>
              Training
              <input name="training" defaultValue={about?.training} />
            </label>
          </div>
          <label>
            Paragraph 1
            <textarea name="paragraph1" defaultValue={about?.paragraph1} rows={5} />
          </label>
          <label>
            Paragraph 2
            <textarea name="paragraph2" defaultValue={about?.paragraph2} rows={4} />
          </label>
          <div className="admin-form-row">
            <label>
              Quote label
              <input name="quoteLabel" defaultValue={about?.quoteLabel} />
            </label>
            <label>
              Quote
              <input name="quote" defaultValue={about?.quote} />
            </label>
          </div>
          <div className="admin-actions">
            <button className="admin-btn" type="submit">Save</button>
          </div>
        </form>
      </div>
    </>
  );
}
