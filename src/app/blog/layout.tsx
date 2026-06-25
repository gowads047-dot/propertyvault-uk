import { ReadingProgress } from "@/components/blog/ReadingProgress";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ReadingProgress />
      {children}
    </>
  );
}
