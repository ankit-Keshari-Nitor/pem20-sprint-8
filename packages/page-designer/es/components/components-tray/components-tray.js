/**
   PRIVATE LICENSE
   */
  
import { extends as _extends } from '../../_virtual/_rollupPluginBabelHelpers.js';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Search, Close } from '@carbon/icons-react';
import './components-tray.scss.js';
import { PALETTE_GROUPS } from '../../constants/constant.js';
import ComponentItem from './component-item/component-item.js';

var _div, _span, _Close, _div2;
function ComponentTray(_ref) {
  let {
    componentMapper
  } = _ref;
  const initialPaletteEntries = React.useRef(collectPaletteEntries(componentMapper));
  const [paletteEntries, setPaletteEntries] = useState(initialPaletteEntries.current);
  const groups = groupEntries(paletteEntries);
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef();
  const simplifyString = useCallback(str => {
    return str.toLowerCase().replace(/\s+/g, '');
  }, []);
  const filter = useCallback(entry => {
    const simplifiedSearchTerm = simplifyString(searchTerm);
    if (!simplifiedSearchTerm) {
      return true;
    }
    const simplifiedEntryLabel = simplifyString(entry.label);
    const simplifiedEntryType = simplifyString(entry.type);
    return simplifiedEntryLabel.includes(simplifiedSearchTerm) || simplifiedEntryType.includes(simplifiedSearchTerm);
  }, [searchTerm, simplifyString]);

  // filter entries on search change
  useEffect(() => {
    const entries = initialPaletteEntries.current.filter(filter);
    setPaletteEntries(entries);
  }, [filter, searchTerm]);
  const handleInput = useCallback(event => {
    setSearchTerm(() => event.target.value);
  }, [setSearchTerm]);
  const handleClear = useCallback(event => {
    setSearchTerm('');
    inputRef.current.focus();
  }, [inputRef, setSearchTerm]);
  return /*#__PURE__*/React.createElement("div", {
    className: "palette"
  }, _div || (_div = /*#__PURE__*/React.createElement("div", {
    className: "palette-header"
  }, "Components")), /*#__PURE__*/React.createElement("div", {
    className: "palette-search-container"
  }, _span || (_span = /*#__PURE__*/React.createElement("span", {
    className: "palette-search-icon"
  }, /*#__PURE__*/React.createElement(Search, null))), /*#__PURE__*/React.createElement("input", {
    className: "palette-search",
    ref: inputRef,
    type: "text",
    placeholder: "Search components",
    value: searchTerm,
    onInput: handleInput
  }), searchTerm && /*#__PURE__*/React.createElement("button", {
    title: "Clear content",
    className: "palette-search-clear",
    onClick: handleClear
  }, _Close || (_Close = /*#__PURE__*/React.createElement(Close, null)))), /*#__PURE__*/React.createElement("div", {
    className: "palette-entries"
  }, groups.map(_ref2 => {
    let {
      label,
      entries,
      id
    } = _ref2;
    return /*#__PURE__*/React.createElement("div", {
      className: "palette-group",
      "data-group-id": id,
      key: id
    }, /*#__PURE__*/React.createElement("span", {
      className: "palette-group-title"
    }, label), /*#__PURE__*/React.createElement("div", {
      className: "palette-fields"
    }, entries.map(entry => {
      return /*#__PURE__*/React.createElement(ComponentItem, _extends({
        key: entry.label
      }, entry));
    })));
  }), groups.length === 0 && (_div2 || (_div2 = /*#__PURE__*/React.createElement("div", {
    className: "palette-no-entries"
  }, "No components found.")))));
}

// Returns a list of group entries.
function groupEntries(entries) {
  const groups = PALETTE_GROUPS.map(group => {
    return {
      ...group,
      entries: []
    };
  });
  const getGroup = id => groups.find(group => id === group.id);
  entries.forEach(entry => {
    const {
      group
    } = entry;
    getGroup(group).entries.push(entry);
  });
  return groups.filter(g => g.entries.length);
}

// Returns a list of palette entries.
function collectPaletteEntries(formFields) {
  return Object.entries(formFields).map(_ref3 => {
    let [type, formField] = _ref3;
    const {
      config: fieldConfig
    } = formField;
    return {
      label: fieldConfig.label,
      type: type,
      group: fieldConfig.group,
      icon: fieldConfig.icon,
      iconUrl: fieldConfig.iconUrl
    };
  }).filter(_ref4 => {
    let {
      type
    } = _ref4;
    return type !== 'default';
  });
}

export { collectPaletteEntries, ComponentTray as default };
