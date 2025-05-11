import { useRef } from 'react';
import { Button, TextInput, CopyButton } from '@carbon/react';

interface CopyLinkProps {
  shareURL: string | null;
  onShare: () => void;
}

export default function CopyLink({ shareURL, onShare }: CopyLinkProps) {
  const input = useRef<HTMLInputElement>(null);

  function onCopyClick() {
    input.current?.select();
    navigator.clipboard.writeText(input.current?.value ?? '');
  }

  if (!shareURL) {
    return (
      <Button kind="tertiary" size="sm" onClick={onShare}>
        Share
      </Button>
    );
  }

  return (
    <div className='playground-copy-link'>
      <TextInput
        id="share-url-input"
        type="text"
        labelText=""
        hideLabel
        ref={input}
        defaultValue={shareURL}
        size="sm"
      />
      <CopyButton
        onClick={onCopyClick}
        iconDescription="Copy to clipboard"
        feedback="Copied!"
      />
    </div>
  );
}
