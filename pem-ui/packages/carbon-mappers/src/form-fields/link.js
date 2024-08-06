import React from 'react';
import { Link as CarbonLink } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, PropsPanelFields, propsPanelAdvanceFields } from '../constant';
import { LinkIcon } from './../icons';

const type = FORM_FIELD_TYPE.LINK;

const Link = ({ field, id }) => {
  const { type, labelText, labelLinkText, label, hrefText, ...rest } = field;
  return (
    <div class="cds--form-item cds--text-input-wrapper">
      <div class="cds--text-input__label-wrapper">{labelText}</div>
      <div class="cds--text-input__field-outer-wrapper">
        <div class="cds--text-input__field-wrapper">
          <CarbonLink data-testid={id} id={id} href={hrefText} {...rest}>
            {labelLinkText === undefined ? label : labelLinkText}
          </CarbonLink>
        </div>
      </div>
    </div>
  );
};

export default Link;

// Config of Link for Left Palette & Right Palette
Link.config = {
  type,
  label: FORM_FIELD_LABEL.LINK,
  group: FORM_FIELD_GROUPS.BASIC_INPUT,
  icon: <LinkIcon />,
  editableProps: {
    Basic: PropsPanelFields[type]
  },
  advanceProps: propsPanelAdvanceFields[type]
};
