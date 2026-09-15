import Image from "next/image";
import type { getContactInfo, getSocialLinks } from "@/lib/content";

export function OpenSkyFooter({
  contact,
  socials,
}: {
  contact: Awaited<ReturnType<typeof getContactInfo>>;
  socials: Awaited<ReturnType<typeof getSocialLinks>>;
}) {
  if (!contact) return null;
  return (
    <section className="os-footer" id="contact">
      <div className="os-footer__glow" />
      <div className="os-footer__inner">
        <div className="os-eyebrow">Bookings &amp; enquiries</div>
        <a className="os-footer__email" href={`mailto:${contact.email}`}>
          {contact.email}
        </a>
        <div className="os-footer__phone">
          {contact.phonePrimary}
          {contact.phoneSecondary && <> &nbsp;//&nbsp; {contact.phoneSecondary}</>}
        </div>
        {socials.length > 0 && (
          <div className="os-footer__socials">
            {socials.map((s) => (
              <a key={s.id} href={s.url}>
                {s.platform}
              </a>
            ))}
          </div>
        )}
        <div className="os-footer__base">
          <Image src="/media/signature-white.png" alt="Abed" width={220} height={64} />
          <div className="os-footer__tagline">{contact.footerTagline}</div>
        </div>
      </div>
    </section>
  );
}
