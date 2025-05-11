/** @jsxImportSource react */
import { ReactNode } from 'react';

interface CarbonWrapperProps {
  children: ReactNode;
  targetDocument?: HTMLDocument;
  dataTheme?: string;
}

const CarbonWrapper = (props: CarbonWrapperProps) => {
  const { children, dataTheme = 'white' } = props;

  return (
    <div id='carbon-wrapper' className={`cds--theme-zone cds--${dataTheme}`} data-carbon-theme={dataTheme}>
      {children}
    </div>
  );
};

export const __createCarbonFrameProvider =
  (props: any) =>
  ({ document }: any) => {
    // Handle both string and object subtheme formats
    const getTheme = (subtheme: any): string => {
      if (typeof subtheme === 'string') {
        // If it's a string, look up the corresponding dataTheme
        const themeMap = {
          white: 'white',
          g10: 'g10',
          g90: 'g90',
          g100: 'g100',
        };
        return themeMap[subtheme as keyof typeof themeMap] || 'white';
      }
      // If it's an object with dataTheme property
      return subtheme?.dataTheme || 'white';
    };

    const dataTheme = getTheme(props.subtheme);
    console.log('Resolved theme:', dataTheme);

    // Add Carbon's core styles
    const coreStyleLink = document.createElement('link');
    coreStyleLink.rel = 'stylesheet';
    coreStyleLink.href = '//unpkg.com/@carbon/styles@1.81.0/css/styles.min.css';
    document.head.appendChild(coreStyleLink);

    return (
      <CarbonWrapper targetDocument={document} dataTheme={dataTheme}>
        {props.children}
      </CarbonWrapper>
    );
  };
