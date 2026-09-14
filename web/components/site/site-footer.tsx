import type { getContactInfo, getSocialLinks } from "@/lib/content";

export function SiteFooter({
  contact,
  socials,
  logoUrl,
}: {
  contact: Awaited<ReturnType<typeof getContactInfo>>;
  socials: Awaited<ReturnType<typeof getSocialLinks>>;
  logoUrl: string;
}) {
  if (!contact) return null;
  return (
    <section className="section--dark site-footer" id="contact">
      <div className="site-footer__grid">
        <div>
          <div className="site-footer__kicker">Contact</div>
          <a className="site-footer__email" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
          <div className="site-footer__phone">
            {contact.phonePrimary}
            {contact.phoneSecondary && <> &nbsp;//&nbsp; {contact.phoneSecondary}</>}
          </div>
        </div>
        {socials.length > 0 && (
          <div>
            <div className="site-footer__kicker">Follow</div>
            <div className="site-footer__socials">
              {socials.map((s) => (
                <a key={s.id} href={s.url}>
                  {s.platform}
                  {s.handle && <> — {s.handle}</>}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="site-footer__base">
        <img src={logoUrl} alt="Abed" />
        <div className="site-footer__base-note">{contact.footerTagline}</div>
        <div className="site-footer__copyright">{contact.copyrightText}</div>
      </div>
    </section>
  );
}
