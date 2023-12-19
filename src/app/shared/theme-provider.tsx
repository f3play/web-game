'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import {useLocalStorage} from "@/lib/hooks/use-local-storage";
import {useThemeColor} from "@/lib/hooks/use-theme-color";

export function ThemeProvider({ children }: React.PropsWithChildren<{}>) {
  const [themeColor, setThemeColor] = useLocalStorage(
    'panda-color',
    '#2a52be'
  );
  useThemeColor(themeColor ? themeColor : '#2a52be');
  return (
    <NextThemeProvider
      attribute="class"
      enableSystem={false}
      defaultTheme="dark"
    >
      {children}
    </NextThemeProvider>
  );
}
