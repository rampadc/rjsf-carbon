import { MouseEvent } from 'react';
import { samples } from '../samples';

export interface SampleSelectorProps {
  onSelected: (sampleName: string) => void;
  selectedSample: string;
}

export default function SampleSelector({ onSelected, selectedSample }: SampleSelectorProps) {
  function onLabelClick(label: string) {
    return (event: MouseEvent) => {
      event.preventDefault();
      setTimeout(() => onSelected(label), 0);
    };
  }

  const sampleList = Object.keys(samples);

  return (
    <div className='sample-selector'>
      <h5>Examples</h5>
      <div className='nav nav-pills'>
        {sampleList.map((label, i) => {
          const isActive = selectedSample === label;
          return (
            <li key={i} role='presentation' className={isActive ? 'active' : ''}>
              <a href='#' onClick={onLabelClick(label)}>
                {label}
              </a>
            </li>
          );
        })}
      </div>
    </div>
  );
}
