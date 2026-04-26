"use client";

import { Button } from "../ui/Button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { List } from "@phosphor-icons/react";

interface NavbarProps {
  onOpenMenu?: () => void;
}

export function Navbar({ onOpenMenu }: NavbarProps) {
  const router = useRouter();
  const { isLogged } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleHome = () => router.push("/");
  const handleLoginClick = () => router.push("/login");

  if (!isMounted) return <header className="h-[72px] w-full bg-neutras-900 shrink-0" />;

  if (isLogged) {
    return (
      <header className="h-[72px] w-full shrink-0 flex items-center justify-between px-4 md:px-8 bg-neutras-900 border-b border-primaria/10 z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={onOpenMenu}
            className="md:hidden text-neutras-50 hover:text-primaria transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <List size={26} weight="bold" />
          </Button>

          <h2
            onClick={handleHome}
            className="text-h4 text-white font-bold leading-none cursor-pointer hover:opacity-80 transition-opacity"
          >
            amentor<span className="text-secundaria">IA</span>.
          </h2>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-[120px] flex items-center justify-between px-4 md:px-[75px] bg-neutras-900 z-20">
      <div className="flex flex-col">
        <h2
          onClick={handleHome}
          className="text-h2 text-white font-bold leading-none cursor-pointer hover:opacity-80 transition-opacity"
        >
          amentor<span className="text-secundaria">IA</span>.
        </h2>
        <p className="hidden sm:block text-caption text-neutras-400 font-medium uppercase tracking-wider mt-1">
          Seu tutor interativo para o ENEM
        </p>
      </div>

      <Button
        variant="default"
        onClick={handleLoginClick}
        className="bg-[linear-gradient(176deg,var(--primary-600)_19%,var(--secondary-400)_100%)] border-0 text-white shadow-lg hover:opacity-90 hover:scale-105 transition-all"
      >
        Fazer login
      </Button>
    </header>
  );
}