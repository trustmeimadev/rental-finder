import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import Footer from "@/components/layout/footer";

type Props = {
  children: ReactNode;
  className?: string;
  hideFooter?: boolean;
};

export default function PageShell({ children, className, hideFooter }: Props) {
  return (
    <div className={cn("flex min-h-screen flex-col bg-background pb-28", className)}>
      <div className="mx-auto w-full max-w-screen-md flex-1 px-4">
        {children}
      </div>
      {!hideFooter && <Footer />}
    </div>
  );
}