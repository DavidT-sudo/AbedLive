import { getContactInfo, getSocialLinks } from "@/lib/content";
import {
  updateContact,
  addSocialLink,
  updateSocialLink,
  deleteSocialLink,
  moveSocialLink,
} from "./actions";

export default async function AdminContactPage() {
  const [contact, socials] = await Promise.all([
    getContactInfo(),
    getSocialLinks(),
  ]);

  return (
    <>
      <h1>Contact &amp; socials</h1>
      <p className="admin-subtitle">Booking details and the footer.</p>

      <div className="admin-card">
        <form className="admin-form" action={updateContact}>
          <label>
            Booking email
            <input name="email" type="email" defaultValue={contact?.email} />
          </label>
          <div className="admin-form-row">
            <label>
              Phone (primary)
              <input name="phonePrimary" defaultValue={contact?.phonePrimary} />
            </label>
            <label>
              Phone (secondary)
              <input name="phoneSecondary" defaultValue={contact?.phoneSecondary} />
            </label>
          </div>
          <div className="admin-form-row">
            <label>
              Footer tagline
              <input name="footerTagline" defaultValue={contact?.footerTagline} />
            </label>
            <label>
              Copyright text
              <input name="copyrightText" defaultValue={contact?.copyrightText} />
            </label>
          </div>
          <div className="admin-actions">
            <button className="admin-btn" type="submit">Save</button>
          </div>
        </form>
      </div>

      <h2 style={{ fontSize: 15, marginTop: 32 }}>Social links</h2>
      <div className="admin-card">
        <div className="admin-list">
          {socials.map((s, i) => (
            <div className="admin-list-item" key={s.id}>
              <div className="admin-order-btns">
                <form action={moveSocialLink.bind(null, s.id, -1)}>
                  <button type="submit" disabled={i === 0}>↑</button>
                </form>
                <form action={moveSocialLink.bind(null, s.id, 1)}>
                  <button type="submit" disabled={i === socials.length - 1}>↓</button>
                </form>
              </div>
              <form
                className="admin-form-row"
                style={{ flex: 1 }}
                action={updateSocialLink.bind(null, s.id)}
              >
                <input name="platform" defaultValue={s.platform} placeholder="Platform" />
                <input name="handle" defaultValue={s.handle} placeholder="Handle" />
                <input name="url" defaultValue={s.url} placeholder="URL" />
                <div className="admin-actions">
                  <button className="admin-btn admin-btn--ghost" type="submit">
                    Save
                  </button>
                </div>
              </form>
              <form action={deleteSocialLink.bind(null, s.id)}>
                <button className="admin-btn admin-btn--danger" type="submit">
                  Remove
                </button>
              </form>
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: 13, marginTop: 20 }}>Add a social link</h3>
        <form className="admin-form-row" action={addSocialLink}>
          <input name="platform" placeholder="Platform (e.g. Instagram)" required />
          <input name="handle" placeholder="Handle" />
          <input name="url" placeholder="URL" />
          <div className="admin-actions">
            <button className="admin-btn" type="submit">Add</button>
          </div>
        </form>
      </div>
    </>
  );
}
