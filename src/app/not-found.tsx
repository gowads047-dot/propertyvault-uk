import Link from "next/link";

export default function NotFound() {
  return (
    <section className="gradient-navy min-h-[70vh] flex items-center justify-center">
      <div className="container-max px-4 text-center">
        <p className="text-8xl font-extrabold text-gold-400 mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>404</p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>Page Not Found</h1>
        <p className="text-navy-200 mb-8 max-w-md mx-auto">The page you&apos;re looking for doesn&apos;t exist or has been moved. Try one of the links below.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          {/* btn-gold, not btn-primary: primary is navy on a navy gradient. */}
          <Link href="/" className="btn-gold">Back to Homepage →</Link>
          <Link href="/calculators" className="inline-flex items-center justify-center px-6 py-3 glass rounded-xl text-white font-semibold hover:bg-white/10 transition-all">Calculators</Link>
        </div>
        <div className="flex flex-wrap gap-3 justify-center text-sm">
          <Link href="/templates" className="text-navy-300 hover:text-white transition-colors">Templates</Link>
          <Link href="/guaranteed-rent" className="text-navy-300 hover:text-white transition-colors">Guaranteed Rent</Link>
          <Link href="/property-investing" className="text-navy-300 hover:text-white transition-colors">Learn</Link>
          <Link href="/tools" className="text-navy-300 hover:text-white transition-colors">Tools</Link>
          <Link href="/glossary" className="text-navy-300 hover:text-white transition-colors">Glossary</Link>
          <Link href="/contact" className="text-navy-300 hover:text-white transition-colors">Contact</Link>
        </div>
      </div>
    </section>
  );
}
