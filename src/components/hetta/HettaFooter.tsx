import Link from "next/link";

export function MakanFooter() {
  return (
    <footer className="border-t" style={{ borderColor: "var(--h-border)", background: "var(--h-surface)" }}>
      <div className="h-container py-12">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[var(--h-accent)] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2L2 8.5V17a1 1 0 001 1h4.5v-5a1.5 1.5 0 011.5-1.5h2a1.5 1.5 0 011.5 1.5v5H17a1 1 0 001-1V8.5L10 2z"/></svg>
              </div>
              <span className="font-bold text-lg" style={{ color: "var(--h-text)" }}>makan</span>
            </div>
            <p className="text-sm" style={{ color: "var(--h-muted)" }}>Find your place. Free property listings for everyone.</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--h-subtle)" }}>Browse</p>
            <div className="space-y-2">
              <Link href="/makan" className="block text-sm" style={{ color: "var(--h-muted)" }}>All listings</Link>
              <Link href="/makan/rooms" className="block text-sm" style={{ color: "var(--h-muted)" }}>Rooms</Link>
              <Link href="/makan?type=flat" className="block text-sm" style={{ color: "var(--h-muted)" }}>Flats</Link>
              <Link href="/makan?type=house" className="block text-sm" style={{ color: "var(--h-muted)" }}>Houses</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--h-subtle)" }}>Landlords</p>
            <div className="space-y-2">
              <Link href="/makan/list" className="block text-sm" style={{ color: "var(--h-muted)" }}>List for free</Link>
              <Link href="/makan/wanted" className="block text-sm" style={{ color: "var(--h-muted)" }}>Property wanted</Link>
              <Link href="/makan/about" className="block text-sm" style={{ color: "var(--h-muted)" }}>About Makan</Link>
              <Link href="/guaranteed-rent" className="block text-sm" style={{ color: "var(--h-muted)" }}>Guaranteed rent</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--h-subtle)" }}>PropertyVault</p>
            <div className="space-y-2">
              <Link href="/calculators" className="block text-sm" style={{ color: "var(--h-muted)" }}>Calculators</Link>
              <Link href="/templates" className="block text-sm" style={{ color: "var(--h-muted)" }}>Templates</Link>
              <Link href="/blog" className="block text-sm" style={{ color: "var(--h-muted)" }}>Blog</Link>
              <Link href="/" className="block text-sm" style={{ color: "var(--h-muted)" }}>Main site</Link>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center" style={{ borderColor: "var(--h-border)" }}>
          <p className="text-xs" style={{ color: "var(--h-subtle)" }}>© 2026 Makan by PropertyVault UK. Free for everyone.</p>
        </div>
      </div>
    </footer>
  );
}
