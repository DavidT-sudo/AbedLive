import Image from "next/image";
import type {getContactInfo, getSocialLinks} from "@/lib/content";
import {SocialIcon} from "./social-icon";

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
            {contact.phoneSecondary && (
              <> &nbsp;/&nbsp; {contact.phoneSecondary}</>
            )}
          </div>
        </div>
        {socials.length > 0 && (
          <div>
            <div className="site-footer__kicker">Follow</div>
            <div className="site-footer__socials">
              {socials.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  aria-label={
                    s.handle ? `${s.platform} — ${s.handle}` : s.platform
                  }
                  title={s.handle ? `${s.platform} — ${s.handle}` : s.platform}
                >
                  <SocialIcon platform={s.platform} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="site-footer__base">
        <Image src={logoUrl} alt="Abed" width={200} height={52} unoptimized />
        <div className="site-footer__base-note flex">
          {contact.footerTagline}
        </div>
        <div className="site-footer__copyright">{contact.copyrightText}</div>
      </div>
    </section>
  );
}
