import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Search, Close } from '@carbon/icons-react';

import './components-tray.scss';
import ComponentItem from './component-item';
import { PALETTE_GROUPS, SIDEBAR_ITEM } from '../../constants/constants';

export default function ComponentsTray({ componentMapper }) {
  const initialPaletteEntries = React.useRef(collectPaletteEntries(componentMapper));
  const [paletteEntries, setPaletteEntries] = useState(initialPaletteEntries.current);

  const groups = groupEntries(paletteEntries);
  const [searchTerm, setSearchTerm] = useState('');

  const inputRef = useRef();

  const simplifyString = useCallback((str) => {
    return str.toLowerCase().replace(/\s+/g, '');
  }, []);

  const filter = useCallback(
    (entry) => {
      const simplifiedSearchTerm = simplifyString(searchTerm);

      if (!simplifiedSearchTerm) {
        return true;
      }

      const simplifiedEntryLabel = simplifyString(entry.component.label);
      const simplifiedEntryType = simplifyString(entry.component.type);

      return simplifiedEntryLabel.includes(simplifiedSearchTerm) || simplifiedEntryType.includes(simplifiedSearchTerm);
    },
    [searchTerm, simplifyString]
  );

  // filter entries on search change
  useEffect(() => {
    const entries = initialPaletteEntries.current.filter(filter);
    setPaletteEntries(entries);
  }, [filter, searchTerm]);

  const handleInput = useCallback(
    (event) => {
      setSearchTerm(() => event.target.value);
    },
    [setSearchTerm]
  );

  const handleClear = useCallback(
    (event) => {
      setSearchTerm('');
      inputRef.current.focus();
    },
    [inputRef, setSearchTerm]
  );

  return (
    <div className="palette">
      {/* Header */}
      <div className="palette-header">Components</div>
      {/* Search Box */}
      <div className="palette-search-container">
        <span className="palette-search-icon">
          <Search />
        </span>
        <input className="palette-search" ref={inputRef} type="text" placeholder="Search components" value={searchTerm} onInput={handleInput} />
        {searchTerm && (
          <button title="Clear content" className="palette-search-clear" onClick={handleClear}>
            <Close />
          </button>
        )}
      </div>
      {/* Form Fields */}
      <div className="palette-entries">
        {groups.map(({ label, entries, id }) => (
          <div className="palette-group" data-group-id={id} key={`ddf_${id}`}>
            <span className="palette-group-title">{label}</span>
            <div className="palette-fields">
              {entries.map((entry, index) => {
                return <ComponentItem key={index} data={entry} />;
              })}
            </div>
          </div>
        ))}
        {groups.length === 0 && <div className="palette-no-entries">No components found.</div>}
      </div>
    </div>
  );
}

// Returns a list of group entries.
function groupEntries(entries) {
  const groups = PALETTE_GROUPS.map((group) => {
    return {
      ...group,
      entries: []
    };
  });

  const getGroup = (id) => groups.find((group) => id === group.id);

  entries.forEach((entry) => {
    const { group } = entry.component;
    getGroup(group).entries.push(entry);
  });

  return groups.filter((g) => g.entries.length);
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
