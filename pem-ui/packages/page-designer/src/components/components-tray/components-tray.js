import React, { useState } from 'react';
import './components-tray.scss';
import ComponentItem from './component-item';
import { SIDEBAR_ITEM } from '../../constants/constants';

export default function ComponentsTray({ componentMapper }) {
  const initialPaletteEntries = React.useRef(collectPaletteEntries(componentMapper));
  const [paletteEntries, setPaletteEntries] = useState(initialPaletteEntries.current);

  return (
    <div className="palette">
      {paletteEntries.map((entry, index) => {
        return <ComponentItem key={index} data={entry} />;
      })}
    </div>
  );
}

// Returns a list of palette entries.
export function collectPaletteEntries(formFields) {
  return Object.entries(formFields)
    .map(([type, formField]) => {
      const { config: fieldConfig } = formField;
      return {
        type: SIDEBAR_ITEM,
        component: {
          type: type,
          label: fieldConfig.label,
          group: fieldConfig.group,
          icon: fieldConfig.icon
        }
      };
    })
    .filter(({ type }) => type !== 'default');
}
