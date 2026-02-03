import { SOCIALS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

type Props = {
  size?: string;
  className?: string;
  text?: boolean;
};

export default function Socials({ size, className, text = false }: Props) {
  return (
    <div
      className={cn(
        `text-[${size}] flex items-center gap-5 text-accent-foreground`,
        className
      )}
    >
      {SOCIALS.map((item, i) => (
        <Link
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          key={i}
        >
          <item.icon className="inline-block" />
          {text && item.social}
        </Link>
      ))}
    </div>
  );
}
