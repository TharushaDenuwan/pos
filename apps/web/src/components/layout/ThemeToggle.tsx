"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@repo/ui/components/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-10 h-10" />;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full w-10 h-10 transition-all hover:bg-gray-100 dark:hover:bg-white/10"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-yellow-500 animate-in zoom-in duration-300" />
      ) : (
        <Moon className="w-5 h-5 text-blue-600 animate-in zoom-in duration-300" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
