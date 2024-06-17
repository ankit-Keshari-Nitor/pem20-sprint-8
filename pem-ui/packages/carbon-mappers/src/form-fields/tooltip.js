import React from 'react';
import { Tooltip as CarbonTooltip } from '@carbon/react';
import { Information } from '@carbon/icons-react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, labelText } from '../constant';
import { Info } from './../icons';

const type = FORM_FIELD_TYPE.INFO;

const Tooltip = ({ field, id }) => {
  const { labelText, ...rest } = field;

  return (
    <CarbonTooltip align="bottom" label={labelText}>
      <button className="sb-tooltip-trigger" type="button">
        <Information />
      </button>
    </CarbonTooltip>
  );
};

export default Tooltip;

// Config of Button for Left Palette & Right Palette
Tooltip.config = {
  type,
  label: FORM_FIELD_LABEL.INFO,
  group: FORM_FIELD_GROUPS.ACTION,
  icon: <Info />,
  editableProps: {
    Basic: [labelText],
    Condition: []
  },
  advanceProps: []
};
