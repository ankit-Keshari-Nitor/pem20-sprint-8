import React from 'react';
import { Link as CarbonLink } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, id,NameLabel, helperText, hrefText, labelText } from '../constant';
import { LinkIcon } from './../icons';

const type = FORM_FIELD_TYPE.LINK;

const Link = ({ field, id }) => {
  const { type, labelText, label, hrefText, ...rest } = field;
  return (
    <CarbonLink data-testid={id} id={id} href={hrefText} {...rest}>
      {labelText === undefined ? label : labelText}
    </CarbonLink>
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
    Basic: [id,NameLabel, labelText, hrefText, helperText]
  },
  advanceProps: []
};
