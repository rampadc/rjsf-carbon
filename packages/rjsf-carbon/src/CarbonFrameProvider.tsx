/** @jsxImportSource react */
import { ReactNode } from 'react';

const CarbonWrapper = (props: { children: ReactNode; targetDocument?: HTMLDocument }) => {
  const { children } = props;

  return (
    // Make sure styles are loaded in the iframe
    <div className='cds--white'>{children}</div>
  );
};

/**
 * __createCarbonFrameProvider is used to ensure Carbon components
 * can be rendered within an iframe.
 * Required for using Carbon components in the playground.
 *
 * NOTE: This is an internal component only used by @rjsf/playground
 */
export const __createCarbonFrameProvider =
  (props: any) =>
  ({ document }: any) => {
    // Add Carbon's styles to the iframe's head
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = '/carbon.css'; // This needs to be available in the playground
    document.head.appendChild(styleLink);

    return <CarbonWrapper targetDocument={document}>{props.children}</CarbonWrapper>;
  };
