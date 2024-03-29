import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { TrashCan } from '@carbon/icons-react';

import './field-renderer.scss';
import { COMPONENT } from '../../../constants/constants';

const FieldRenderer = ({ data, path, componentMapper, renderRow, handleDrop, deleteFormField }) => {
  let compent_type;
  var isNestedBlock = false;
  if (data.maintype) {
    compent_type = data.maintype;
    isNestedBlock = true;
  } else {
    compent_type = data.component.type;
  }
  const FormFieldComponent = componentMapper[compent_type];

  if (!FormFieldComponent) {
    throw new Error(`cannot render field <${compent_type}>`);
  }

  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    item: { type: COMPONENT, id: data.id, path, component: data.component },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);
  return (
    <div ref={ref} style={{ opacity }}>
      {
        <div className="element">
          <span className="delete-icon">
            <TrashCan onClick={(e) => deleteFormField(e, path)} />
          </span>
          {isNestedBlock ? (
            <FormFieldComponent renderRow={renderRow} row={data} currentPath={path} handleDrop={handleDrop} componentMapper={componentMapper} />
          ) : (
            <FormFieldComponent field={data.component} id={data.id} />
          )}
        </div>
      }
    </div>
  );
};

export default FieldRenderer;
