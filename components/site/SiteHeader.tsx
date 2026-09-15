'use client';

import Image from 'next/image';
import { withBase } from '@/lib/asset';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useExperience } from '@/components/providers/Experience';
import { RegisterLink } from '@/components/ui/RegisterLink';
import { buttonClass } from '@/components/ui/button';
import { cx } from '@/components/ui/cx';
import { NAV } from '@/lib/event';
import { preloadRouteChunks } from '@/lib/preload';
import { MobileMenu } from './MobileMenu';

export function isActivePath(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const mode = useExperience();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 12);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const intent = useCallback(
    (href: string) => {
      router.prefetch(href);
      if (mode === '3d') preloadRouteChunks(href);
    },
    [router, mode],
  );

  const closeAndReturnFocus = useCallback(() => {
    setOpen(false);
    menuButton.current?.focus();
  }, []);

  const closeOnNavigate = useCallback(() => setOpen(false), []);

  return (
    <header
      className={cx(
        'fixed inset-x-0 top-0 z-nav transition-colors duration-200 ease-out',
        scrolled ? 'bg-canvas/95 shadow-lift-2' : 'bg-gradient-to-b from-canvas/85 to-canvas/0',
      )}
    >
      <div className="frame flex h-16 items-center gap-3 lg:h-20">
        <Link href="/" className="shrink-0 rounded-xs" onMouseEnter={() => intent('/')} onFocus={() => intent('/')}>
          <Image
            src={withBase('/logos/sfmtb-trilogy-race.png')}
            alt="SFMTB Trilogy Race, ir al inicio"
            width={640}
            height={287}
            sizes="(min-width: 1024px) 110px, 90px"
            loading="eager"
            className="h-9 w-auto lg:h-11"
          />
        </Link>

        <nav aria-label="Principal" className="ml-auto hidden lg:block">
          <ul className="flex items-center">
            {NAV.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    onMouseEnter={() => intent(item.href)}
                    onFocus={() => intent(item.href)}
                    className={cx(
                      'relative flex min-h-11 items-center px-3 text-sm transition-colors duration-150 xl:px-4 xl:text-base',
                      active ? 'font-semibold text-ink' : 'font-normal text-ink-muted hover:text-ink',
                    )}
                  >
                    {item.label}
                    {active ? <span aria-hidden className="absolute inset-x-3 bottom-1 h-0.5 bg-accent xl:inset-x-4" /> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <RegisterLink
          icon={false}
          className={buttonClass('primary', 'md', 'ml-auto whitespace-nowrap px-4 text-sm md:px-5 md:text-base lg:ml-3')}
        >
          Reservar mi cupo
        </RegisterLink>

        <button
          ref={menuButton}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label="Abrir menú"
          className="-mr-2 grid size-11 place-items-center rounded-sm text-ink lg:hidden"
        >
          <Menu className="size-6" aria-hidden />
        </button>
      </div>

      <MobileMenu open={open} pathname={pathname} onClose={closeAndReturnFocus} onNavigate={closeOnNavigate} />
    </header>
  );
}
