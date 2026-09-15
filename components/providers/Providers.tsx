'use client';

import { LazyMotion, MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';
import { ExperienceProvider } from './Experience';

const loadMotionFeatures = () => import('@/components/ui/motion-features').then((mod) => mod.default);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user">
        <ExperienceProvider>{children}</ExperienceProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
