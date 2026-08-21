// ── Contact links ──────────────────────────────────────────
//
// The WhatsApp link used to live here as WHATSAPP_URL, but it was only
// imported in one place — the other 35 links across the site hardcoded the
// wa.me URL, which embedded a personal mobile number in the markup of thirty
// pages. Those are now all routed through /contact.
//
// If a dedicated business number is set up later, add it here and point the
// CTAs back at it: one change, not thirty-six.

/** Primary contact route — the enquiry form. */
export const CONTACT_URL = "/contact";

/** Guaranteed-rent enquiries land on the form anchored to the enquiry block. */
export const ENQUIRY_URL = "/guaranteed-rent#enquiry";

export const CALENDLY_URL = "https://calendly.com/gowads047/30min";
