import { describe, it, expect, vi, beforeEach } from "vitest";

const createSignedUrl = vi.fn();
vi.mock("@/lib/supabase", () => ({
  supabase: { storage: { from: () => ({ createSignedUrl }) } },
}));

beforeEach(() => createSignedUrl.mockReset());

describe("rentura-docs", () => {
  it("recovers the object path from the stored public URL, spaces and all", async () => {
    const { docPath } = await import("./rentura-docs");
    expect(docPath("https://x.supabase.co/storage/v1/object/public/rentura-docs/uid-1/1700000000_Tenancy%20Agreement.pdf"))
      .toBe("uid-1/1700000000_Tenancy Agreement.pdf");
    expect(docPath("https://x.supabase.co/storage/v1/object/public/rentura-docs/uid-1/a.pdf?download=1")).toBe("uid-1/a.pdf");
    expect(docPath("https://elsewhere.example/a.pdf")).toBeNull();
  });

  it("signs the path for ten minutes rather than handing out the public URL of a private bucket", async () => {
    createSignedUrl.mockResolvedValue({ data: { signedUrl: "https://x.supabase.co/storage/v1/object/sign/rentura-docs/uid-1/a.pdf?token=t" }, error: null });
    const { signedDocUrl } = await import("./rentura-docs");
    const url = await signedDocUrl("https://x.supabase.co/storage/v1/object/public/rentura-docs/uid-1/a.pdf");
    expect(url).toContain("/object/sign/");
    expect(createSignedUrl).toHaveBeenCalledWith("uid-1/a.pdf", 600);
  });

  it("returns null when storage refuses, so the page can say so", async () => {
    createSignedUrl.mockResolvedValue({ data: null, error: { message: "Object not found" } });
    const { signedDocUrl } = await import("./rentura-docs");
    expect(await signedDocUrl("https://x.supabase.co/storage/v1/object/public/rentura-docs/uid-1/gone.pdf")).toBeNull();
  });
});
