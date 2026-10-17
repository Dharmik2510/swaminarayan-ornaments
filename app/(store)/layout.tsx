import type { ReactNode } from "react";
import StoreShell from "@/components/store/StoreShell";
import "./vitrine.css";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <StoreShell>
      {children}
      <noscript>
        <style>{`[data-sc-cue],[data-sc-in],[data-sc-stagger]>*{opacity:1!important;transform:none!important}`}</style>
      </noscript>
    </StoreShell>
  );
}
