import { Logo } from "@/components/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,color-mix(in_oklch,var(--champagne)_18%,transparent),transparent)]"
      />
      <div className="relative mb-8">
        <Logo />
      </div>
      <div className="relative w-full max-w-md rounded-2xl border border-border/60 bg-card p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
