import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function StickyActionBar({ children }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-white px-4 py-3">
      <div className="mx-auto max-w-screen-md">{children}</div>
    </div>
  );
}