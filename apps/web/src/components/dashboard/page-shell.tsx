import React from "react";

type Props = {
  title: string;
  description: string;
  actionComponent: React.ReactNode;
};

export function AppPageShell({ actionComponent, description, title }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight mb-1 font-sans text-primary">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {actionComponent}
    </div>
  );
}
