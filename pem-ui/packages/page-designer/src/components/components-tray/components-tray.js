import React from 'react';
import './components-tray.scss';
import ComponentItem from './component-item';
import { collectPaletteEntries } from '../../utils/helpers';

export default function ComponentsTray({ componentMapper }) {
  const initialPaletteEntries = React.useRef(collectPaletteEntries(componentMapper));
  return (
    <div className="palette">
      {initialPaletteEntries &&
        initialPaletteEntries.current.map((entry, index) => {
          return <ComponentItem key={index} data={entry} />;
        })}
    </div>
  );
}

// Returns a list of palette entries.
// export function collectPaletteEntries(formFields) {
//   return Object.entries(formFields)
//     .map(([type, formField]) => {
//       const { config: fieldConfig } = formField;
//       return {
//         type: SIDEBAR_ITEM,
//         component: {
//           type: type,
//           label: fieldConfig.label,
//           group: fieldConfig.group,
//           icon: fieldConfig.icon
//         }
//       };
//     })
//     .filter(({ type }) => type !== 'default');
// }
