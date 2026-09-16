import {
  Backpack,
  Banknote,
  Camera,
  Gift,
  GlassWater,
  Medal,
  Package,
  Route,
  ShieldCheck,
  Siren,
  Ticket,
  Tickets,
  Truck,
  UtensilsCrossed,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { KitIcon as KitIconName } from '@/lib/event';

const ICONS: Record<KitIconName, LucideIcon> = {
  bib: Ticket,
  medal: Medal,
  sponsors: Package,
  photo: Camera,
  bag: Backpack,
  insurance: ShieldCheck,
  aid: GlassWater,
  mechanic: Wrench,
  emergency: Siren,
  sweep: Truck,
  lunch: UtensilsCrossed,
  route: Route,
  cash: Banknote,
  gift: Gift,
  raffle: Tickets,
};

export function KitIcon({ name, className }: { name: KitIconName; className?: string }) {
  const Icon = ICONS[name];
  return <Icon className={className} aria-hidden strokeWidth={1.75} />;
}
