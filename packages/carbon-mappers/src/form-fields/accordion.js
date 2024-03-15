import React from 'react';
import { AccordionItem, Accordion as CarbonAccordion } from '@carbon/react';
import { FORM_FIELD_TYPE, editableProps } from '../constant';

const type = FORM_FIELD_TYPE.ACCORDION;

const Accordion = ({ field }) => {
  const { id, type, labelText, ...rest } = field;

  return (
    <CarbonAccordion data-testid={id} id={id} {...rest}>
      <AccordionItem title={labelText}>
        <p></p>
      </AccordionItem>
    </CarbonAccordion>
  );
};

export default Accordion;

// Config of Accordion for Left Palette & Right Palette
Accordion.config = {
  type,
  label: 'Accordion',
  group: 'panel',
  editableProps: editableProps,
  advanceProps: []
};
