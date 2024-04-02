import React from 'react';
import { AccordionItem, Accordion as CarbonAccordion } from '@carbon/react';
import { FORM_FIELD_TYPE, editableProps } from '../constant';
import { Plan } from '@carbon/icons-react';
import TabCanvas from '../../../page-designer/src/components/canvas/tab-canvas';


const type = FORM_FIELD_TYPE.ACCORDION;

const Accordion = ({ renderRow, row, currentPath, handleDrop, componentMapper }) => {
  //const { id, type, labelText, ...rest } = field;

  return (
    <CarbonAccordion data-testid={'accordion-id'} id={'accordion-id'}>
      <AccordionItem title={'Accordion-title'}>
        <TabCanvas layout={row.children} handleDrop={handleDrop} renderRow={renderRow} componentMapper={componentMapper} path={currentPath} />
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
  icon: <Plan />,
  editableProps: editableProps,
  advanceProps: []
};
