export function Mark({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M7 23.5h18M9 23.5V9" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
