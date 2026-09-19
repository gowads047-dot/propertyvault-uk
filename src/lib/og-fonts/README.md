# Fonts for next/og cards

`Cairo-Bold.woff` — Cairo, weight 700, by Mohamed Gaber. SIL Open Font
License 1.1 (https://openfontlicense.org). Fetched from Google Fonts on
19 Sept 2026 for the Arabic blog cards.

Why this font: `next/og` can fetch a Google font for a script it meets at
render time, but the one it picks for Arabic (Noto Sans Arabic) carries a
GSUB lookup its shaper does not support (`lookupType 5 / substFormat 3`)
and the render throws. Of the Arabic fonts tried, Cairo shaped correctly
and measured most evenly. See `lib/og-blog.tsx` for the RTL handling the
renderer needs.
