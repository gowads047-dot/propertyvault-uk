import NextLink from "next/link";
import type { ComponentProps } from "react";
import { withTrailingSlash } from "@/lib/trailing-slash";

type Props = ComponentProps<typeof NextLink>;

/**
 * next/link, with the trailing slash it used to add itself.
 *
 * Every page URL on the site is canonical with a slash. next/link normally
 * renders hrefs that way, but skipTrailingSlashRedirect (needed so /api/
 * calls are rewritten rather than bounced — see lib/trailing-slash.ts)
 * also tells it to stop, and it did: every internal link became a 308 for
 * whoever followed it, Googlebot included. This is the same component with
 * the same props; the only difference is the href it writes.
 *
 * It is the only file allowed to import next/link (eslint.config.mjs).
 */
export default function Link({ href, ...rest }: Props) {
  const fixed =
    typeof href === "string"
      ? withTrailingSlash(href)
      : href.pathname
        ? { ...href, pathname: withTrailingSlash(href.pathname) }
        : href;
  return <NextLink href={fixed} {...rest} />;
}
