import React from 'react';
import { Link as CarbonLink } from '@carbon/react';
import { FORM_FIELD_TYPE, editableProps } from '../constant';
import { Link as LinkIcon } from '@carbon/icons-react';

const type = FORM_FIELD_TYPE.LINK;

const Link = ({ field }) => {
  const { id, type, labelText, ...rest } = field;
  return (
    <CarbonLink data-testid={id} id={id} {...rest}>
      {field.labelText}
    </CarbonLink>
  );
};

export default Link;

// Config of Link for Left Palette & Right Palette
Link.config = {
  type,
  label: 'Link',
  group: 'basic-input',
  icon: <LinkIcon />,
  editableProps: {
    Basic: [...editableProps.Basic]
  },
  advanceProps: []
};
