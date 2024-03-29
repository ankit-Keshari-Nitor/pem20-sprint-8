import React from 'react';
import { AccordionItem, Accordion as CarbonAccordion } from '@carbon/react';
import { FORM_FIELD_TYPE, editableProps } from '../constant';
import { Plan } from '@carbon/icons-react';

const type = FORM_FIELD_TYPE.ACCORDION;

const Accordion = ({ renderRow, row, currentPath }) => {
  //const { id, type, labelText, ...rest } = field;

  return (
    <CarbonAccordion data-testid={'accordion-id'} id={'accordion-id'}>
      <AccordionItem title={'Accordion-title'}>{renderRow(row, currentPath, renderRow)}</AccordionItem>
    </CarbonAccordion>
  );
};

export default Accordion;

// Config of Accordion for Left Palette & Right Palette
Accordion.config = {
  type,
  label: 'Accordion',
  group: 'panel',
  icon: <Plan />,
  editableProps: editableProps,
  advanceProps: []
};
