import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Popover and Suspense",
};

export default function PopoverAndSuspenseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <h1>Popover and Suspense</h1>
      {children}
    </main>
  );
}
