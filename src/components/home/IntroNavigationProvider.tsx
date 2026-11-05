"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

const SkipIntroContext = createContext(false);

export function useSkipIntro() {
  return useContext(SkipIntroContext);
}

export default function IntroNavigationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [navigation, setNavigation] = useState({ pathname, skipIntro: false });

  // Remember client-side navigation only. A new document always starts with the intro.
  if (navigation.pathname !== pathname) {
    setNavigation({
      pathname,
      skipIntro: pathname === "/" && navigation.pathname === "/menu",
    });
  }

  return <SkipIntroContext.Provider value={navigation.skipIntro}>{children}</SkipIntroContext.Provider>;
}
