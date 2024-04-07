import React from 'react';
import { DropZone } from '../../elements';
import FieldRenderer from './field-renderer/field-renderer';

export default function Canvas({ layout, handleDrop, renderRow, componentMapper, selectedField, deleteFormField }) {
  const renderComponent = (component, currentPath, renderRow) => {
    return (
      <div
        onClick={(e) => {
          selectedField(e, component, currentPath);
        }}
      >
        <FieldRenderer
          key={component.id}
          data={component}
          path={currentPath}
          componentMapper={componentMapper}
          renderRow={renderRow}
          handleDrop={handleDrop}
          deleteFormField={deleteFormField}
          selectedField={selectedField}
        />
      </div>
    );
  };

  return (
    <>
      {layout.map((component, index) => {
        const currentPath = `${index}`;
        return (
          <React.Fragment key={component.id}>
            <DropZone
              data={{
                path: currentPath,
                childrenCount: layout.length
              }}
              onDrop={handleDrop}
              path={currentPath}
            />
            {renderComponent(component, currentPath, renderRow)}
          </React.Fragment>
        );
      })}
      <DropZone
        data={{
          path: `${layout.length}`,
          childrenCount: layout.length
        }}
        onDrop={handleDrop}
        isLast
      />
    </>
  );
}
