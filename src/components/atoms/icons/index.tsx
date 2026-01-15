interface IconProps {
  className?: string;
}

export function FaceIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeLinecap="round" />
      <circle cx="9" cy="9" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9" r="1.5" fill="currentColor" stroke="none" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

export function BodyIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="4" r="2" />
      <path d="M12 6v4m0 0l-4 8m4-8l4 8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 10h8" strokeLinecap="round" />
      <path d="M6 22l2-4m10 4l-2-4" strokeLinecap="round" />
    </svg>
  );
}

export function MakeupIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M20 4l-8 8" strokeLinecap="round" />
      <path d="M12 12l-4 8h8l-4-8z" strokeLinejoin="round" />
      <circle cx="20" cy="4" r="2" />
      <path d="M4 14c2 0 3 2 3 4s-1 4-3 4" strokeLinecap="round" />
    </svg>
  );
}

export function ManicureIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M6 20V8a2 2 0 012-2h8a2 2 0 012 2v12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" strokeLinecap="round" />
      <path d="M12 10v4M9 12h6" strokeLinecap="round" />
      <path d="M6 14h12" strokeLinecap="round" opacity="0.5" />
      <ellipse cx="12" cy="18" rx="4" ry="2" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

export function PedicureIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M4 18c0-3 2-6 6-6h4c4 0 6 3 6 6v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
      <path d="M8 12V8a4 4 0 018 0v4" strokeLinecap="round" />
      <circle cx="8" cy="17" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="17" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WaxIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="6" y="4" width="12" height="16" rx="2" />
      <path d="M6 8h12M6 12h12M6 16h12" strokeLinecap="round" opacity="0.3" />
      <path d="M10 2v4M14 2v4" strokeLinecap="round" />
      <path d="M9 20l3-4 3 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SolariumIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2" strokeLinecap="round" />
      <path d="M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

export function LaserIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M12 2L8 8l4-2 4 2-4-6z" strokeLinejoin="round" />
      <path d="M12 8v8" strokeLinecap="round" />
      <circle cx="12" cy="18" r="3" />
      <path d="M9 18h6" strokeLinecap="round" opacity="0.5" />
      <path d="M4 4l4 4M20 4l-4 4" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

export function AppointmentIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 10h18" strokeLinecap="round" />
      <path d="M8 2v4M16 2v4" strokeLinecap="round" />
      <circle cx="12" cy="16" r="2" fill="currentColor" opacity="0.3" />
      <path d="M12 14v-2" strokeLinecap="round" />
    </svg>
  );
}

export function SaltCaveIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M4 20c0-8 3-14 8-14s8 6 8 14" strokeLinecap="round" />
      <path d="M8 20v-4a4 4 0 018 0v4" strokeLinecap="round" />
      <circle cx="8" cy="10" r="1" fill="currentColor" opacity="0.5" />
      <circle cx="16" cy="10" r="1" fill="currentColor" opacity="0.5" />
      <circle cx="12" cy="8" r="1" fill="currentColor" opacity="0.5" />
      <path d="M6 14h2M16 14h2" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

export function SparkleIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z" strokeLinejoin="round" />
      <path d="M5 5l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" strokeLinejoin="round" opacity="0.5" />
    </svg>
  );
}

export function ShoppingBagIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M6 6h12l1.5 12a2 2 0 01-2 2H6.5a2 2 0 01-2-2L6 6z" />
      <path d="M9 6V4a3 3 0 016 0v2" strokeLinecap="round" />
      <path d="M10 10v2M14 10v2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function TagIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <circle cx="7" cy="7" r="2" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

export function DashboardIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export function PackageIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
    </svg>
  );
}

export function CartIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
    </svg>
  );
}

export function CalendarIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

export function ClockIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" strokeLinecap="round" />
    </svg>
  );
}

export function CurrencyIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="10" />
      <path d="M14.5 9a2.5 2.5 0 00-5 0c0 2 5 2 5 4a2.5 2.5 0 01-5 0M12 6v2m0 8v2" strokeLinecap="round" />
    </svg>
  );
}

export function LogOutIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

