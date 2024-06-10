import React from 'react';
import { AccordionItem, Accordion as CarbonAccordion } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, labelText } from '../constant';
import { Plan } from '@carbon/icons-react';
import TabCanvas from '../../../page-designer/src/components/canvas/tab-canvas';

const type = FORM_FIELD_TYPE.ACCORDION;

const Accordion = ({ renderRow, row, currentPath, handleDrop, componentMapper, onFieldSelect, onFieldDelete, previewMode, onChangeHandle }) => {
  return (
    <CarbonAccordion data-testid={'accordion-id'} id={'accordion-id'}>
      <AccordionItem title={row.component.labelText} open>
        <TabCanvas
          layout={row.children}
          handleDrop={handleDrop}
          renderRow={renderRow}
          componentMapper={componentMapper}
          path={currentPath}
          onFieldSelect={onFieldSelect}
          onFieldDelete={onFieldDelete}
          previewMode={previewMode}
          onChangeHandle={onChangeHandle}
        />
      </AccordionItem>
    </CarbonAccordion>
  );
};

export default Accordion;

// Config of Accordion for Left Palette & Right Palette
Accordion.config = {
  type,
  label: FORM_FIELD_LABEL.ACCORDION,
  group: FORM_FIELD_GROUPS.PANEL,
  icon: <Plan />,
  editableProps: {
    Basic: [labelText],
    Condition: []
  },
  advanceProps: []
};
