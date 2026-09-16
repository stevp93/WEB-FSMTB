'use client';

import Image from 'next/image';
import { withBase } from '@/lib/asset';
import Link from 'next/link';
import { AnimatePresence, m } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { getLenis } from '@/components/providers/SmoothScroll';
import { Prices } from '@/components/ui/Prices';
import { RegisterLink } from '@/components/ui/RegisterLink';
import { buttonClass } from '@/components/ui/button';
import { cx } from '@/components/ui/cx';
import { EASE_IN, EASE_OUT } from '@/components/ui/motion';
import { NAV, isActivePath } from '@/lib/event';

type Props = {
  open: boolean;
  pathname: string;
  onClose: () => void;
  onNavigate: () => void;
};

const list = { show: { transition: { staggerChildren: 0.04 } } };
const item = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.24, ease: EASE_OUT } },
};

export function MobileMenu({ open, pathname, onClose, onNavigate }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusables = () =>
      Array.from(panel.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []);
    requestAnimationFrame(() => focusables()[0]?.focus());

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const nodes = focusables();
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      lenis?.start();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <m.div
          key="menu"
          ref={panel}
          id="menu-movil"
          role="dialog"
          aria-modal="true"
          aria-label="Menú principal"
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.24, ease: EASE_OUT } }}
          exit={{ opacity: 0, transition: { duration: 0.16, ease: EASE_IN } }}
          className="fixed inset-0 z-menu flex min-h-dvh flex-col overflow-y-auto bg-canvas lg:hidden"
        >
          <div className="frame flex h-16 shrink-0 items-center justify-between">
            <Image src={withBase('/logos/sfmtb-trilogy-race.png')} alt="" width={640} height={287} sizes="90px" className="h-9 w-auto" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar menú"
              className="-mr-2 grid size-11 place-items-center rounded-sm text-ink"
            >
              <X className="size-6" aria-hidden />
            </button>
          </div>

          <nav aria-label="Principal" className="frame flex-1 pt-4">
            <m.ul variants={list} initial="hidden" animate="show" className="border-t border-line/15">
              {NAV.map((link) => {
                const active = isActivePath(pathname, link.href);
                return (
                  <m.li key={link.href} variants={item} className="border-b border-line/15">
                    <Link
                      href={link.href}
                      onClick={onNavigate}
                      aria-current={active ? 'page' : undefined}
                      className={cx(
                        'flex min-h-16 items-center justify-between gap-4 py-2 font-display text-xl',
                        active ? 'font-semibold text-ink' : 'font-medium text-ink-muted',
                      )}
                    >
                      {link.label}
                      {active ? <span className="font-sans text-sm font-semibold text-accent">Estás aquí</span> : null}
                    </Link>
                  </m.li>
                );
              })}
            </m.ul>
          </nav>

          <div className="frame flex shrink-0 flex-col gap-3 pb-8 pt-8">
            <Prices />
            <RegisterLink onClick={onNavigate} className={buttonClass('primary', 'lg', 'mt-3 w-full')}>
              Reservar mi cupo
            </RegisterLink>
          </div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
