import { ShopHeader } from "@/components/layout/ShopHeader";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function HomepageLayout({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      <ShopHeader />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}
