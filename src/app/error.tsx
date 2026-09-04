"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

/**
 * What a visitor sees when a page throws.
 *
 * There was no error boundary, so anything thrown in a page or a server
 * component fell through to Next's default screen: unstyled, unbranded, no
 * navigation, and no way to tell anyone. On a site whose argument is that its
 * numbers can be trusted, that is the worst possible moment to look broken.
 *
 * Two rules here. The visitor is told what happened and given somewhere to go.
 * And they are never shown the error itself — a stack or a message can carry a
 * query, a path or an upstream detail — so it goes to the console, where the
 * platform's logs pick it up, and the digest is offered as a reference.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled page error:", error);
  }, [error]);

  return (
    <section className="gradient-navy min-h-[70vh] flex items-center justify-center">
      <div className="container-max px-4 text-center">
        <p
          className="text-6xl font-extrabold text-gold-400 mb-4"
          style={{ fontFamily: "var(--font-family-heading)" }}
        >
          Something broke
        </p>
        <h1
          className="text-2xl md:text-3xl font-extrabold text-white mb-3"
          style={{ fontFamily: "var(--font-family-heading)" }}
        >
          That is our fault, not yours
        </h1>
        <p className="text-navy-200 mb-8 max-w-md mx-auto">
          This page failed to load. Nothing you entered has been sent anywhere, and no calculation on
          it should be relied on. Try again — and if it keeps happening, tell us and we will fix it.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          {/* btn-gold, not btn-primary: primary is navy (#0f1b36), which on
              this navy gradient is a button you have to hunt for. The 404 page
              had the same problem and is fixed alongside. */}
          <button onClick={reset} className="btn-gold">
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 glass rounded-xl text-white font-semibold hover:bg-white/10 transition-all"
          >
            Back to homepage
          </Link>
        </div>

        <p className="text-sm text-navy-300">
          Still stuck?{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold-400 hover:text-gold-300 underline">
            {CONTACT_EMAIL}
          </a>
          {error.digest && (
            <>
              {" — quote reference "}
              <code className="text-navy-200">{error.digest}</code>
            </>
          )}
        </p>
      </div>
    </section>
  );
}
