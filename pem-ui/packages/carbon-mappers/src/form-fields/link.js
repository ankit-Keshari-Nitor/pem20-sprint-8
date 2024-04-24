import React from 'react';
import { Link as CarbonLink } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, hrefText, labelText } from '../constant';
import { LinkIcon } from './../icons';

const type = FORM_FIELD_TYPE.LINK;

const Link = ({ field, id }) => {
  const { type, labelText, hrefText, ...rest } = field;
  return (
    <CarbonLink data-testid={id} id={id} href={hrefText} {...rest}>
      {labelText}
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
    Basic: [labelText, hrefText]
  },
  advanceProps: []
};
