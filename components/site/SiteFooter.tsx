import Image from 'next/image';
import Link from 'next/link';
import { FileDown, Globe, Instagram, MessageCircle } from 'lucide-react';
import { DeveloperLogo } from '@/components/ui/DeveloperLogo';
import { withBase } from '@/lib/asset';
import { EVENT, NAV, ORGANIZERS } from '@/lib/event';
import { DEVELOPER_MESSAGE, GENERAL_MESSAGE, whatsappLink } from '@/lib/whatsapp';

export function SiteFooter() {
  const { developer, contact } = EVENT;
  return (
    <footer className="relative z-content border-t border-line/15">
      <div className="frame grid gap-12 py-14 md:grid-cols-12 md:gap-8 lg:py-20">
        <div className="md:col-span-5">
          <Image
            src={withBase('/logos/sfmtb-oficial.png')}
            alt="San Francisco MTB Oficial"
            width={720}
            height={323}
            sizes="176px"
            className="h-auto w-44"
          />
          <p className="mt-6 font-display text-lg font-semibold text-ink">{EVENT.signature}</p>
          <p className="mt-2 text-ink-muted">
            {EVENT.motto}. {EVENT.place}.
          </p>
        </div>

        <div className="md:col-span-4">
          <h2 className="font-semibold text-ink">Organiza y apoya</h2>
          <ul className="mt-3 space-y-2 text-ink-muted">
            {ORGANIZERS.map((org) => (
              <li key={org.name}>{org.name}</li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="font-semibold text-ink">Contacto</h2>
          <ul className="mt-1">
            <li>
              <a
                href={whatsappLink(GENERAL_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 text-ink-muted transition-colors duration-150 hover:text-ink"
              >
                <MessageCircle className="size-4 text-accent" aria-hidden />
                <span className="tabular">{contact.phoneLabel}</span>
              </a>
            </li>
            <li>
              <a
                href={contact.website}
                className="inline-flex min-h-11 items-center gap-2 text-ink-muted transition-colors duration-150 hover:text-ink"
              >
                <Globe className="size-4 text-accent" aria-hidden />
                {contact.websiteLabel}
              </a>
            </li>
            <li>
              <a
                href={withBase(EVENT.rulesPdf.src)}
                download
                className="inline-flex min-h-11 items-center gap-2 text-ink-muted transition-colors duration-150 hover:text-ink"
              >
                <FileDown className="size-4 text-accent" aria-hidden />
                Reglamento (PDF)
              </a>
            </li>
            {contact.instagram.map((account) => (
              <li key={account.handle}>
                <a
                  href={account.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 text-ink-muted transition-colors duration-150 hover:text-ink"
                >
                  <Instagram className="size-4 shrink-0 text-accent" aria-hidden />
                  {account.handle}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line/10">
        <div className="frame flex flex-col gap-4 py-6 text-sm text-ink-muted lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Pie de página">
            <ul className="flex flex-wrap gap-x-5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="inline-flex min-h-11 items-center transition-colors duration-150 hover:text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col gap-x-6 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href={developer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-11 items-center gap-3 self-start transition-colors duration-150 hover:text-ink sm:self-auto"
            >
              <span>Desarrollado por</span>
              <DeveloperLogo decorative />
              <span className="font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4 group-hover:text-accent">
                {developer.name}
              </span>
            </a>
            <a
              href={whatsappLink(DEVELOPER_MESSAGE, developer.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp de ${developer.name}: ${developer.phoneLabel}`}
              className="inline-flex min-h-11 items-center gap-2 self-start transition-colors duration-150 hover:text-ink sm:self-auto"
            >
              <MessageCircle className="size-4 text-accent" aria-hidden />
              <span className="tabular">{developer.phoneLabel}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
