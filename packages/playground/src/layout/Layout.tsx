import { PropsWithChildren, createContext, useContext, useState, useMemo } from 'react';
import { Theme, Content } from '@carbon/react';

import Footer from './Footer';

type CarbonThemeType = 'white' | 'g10' | 'g90' | 'g100';

interface ThemeContextType {
  formTheme: CarbonThemeType;
  setFormTheme: (theme: CarbonThemeType) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  formTheme: 'g10',
  setFormTheme: () => {},
});

export function useFormTheme() {
  return useContext(ThemeContext);
}

export function Layout({ children }: PropsWithChildren) {
  const [formTheme, setFormTheme] = useState<CarbonThemeType>('g10');

  const contextValue = useMemo(() => ({ formTheme, setFormTheme }), [formTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <Theme theme='white'>
        <Content>
          {children}
          <Footer />
        </Content>
      </Theme>
    </ThemeContext.Provider>
  );
}
