'use client';

import { useEffect, useState } from 'react';

const DAY = 86_400_000;
const HOUR = 3_600_000;
const MINUTE = 60_000;

export function Countdown({ target, label }: { target: string; label: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const diff = now === null ? null : Math.max(0, new Date(target).getTime() - now);
  const units: [string, number | null][] = [
    ['días', diff === null ? null : Math.floor(diff / DAY)],
    ['horas', diff === null ? null : Math.floor((diff % DAY) / HOUR)],
    ['minutos', diff === null ? null : Math.floor((diff % HOUR) / MINUTE)],
  ];

  return (
    <div>
      <p id="cuenta-regresiva" className="text-sm text-ink-muted">
        {label}
      </p>
      <dl aria-labelledby="cuenta-regresiva" className="mt-1 flex gap-6">
        {units.map(([unit, value]) => (
          <div key={unit} className="flex flex-col-reverse">
            <dt className="text-sm text-ink-muted">{unit}</dt>
            <dd className="tabular font-display text-2xl font-semibold text-ink">
              {value === null ? '--' : String(value).padStart(2, '0')}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
