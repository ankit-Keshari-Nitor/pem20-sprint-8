import React from 'react';
import { DropZone } from '../../elements';
import classNames from 'classnames';
import FieldRenderer from './field-renderer/field-renderer';

export default function Canvas({ layout, handleDrop, renderRow, componentMapper, selectedField, deleteFormField, previewMode }) {
  const renderComponent = (component, currentPath, renderRow) => {
    return (
      <div
        onClick={(e) => {
          !previewMode && selectedField(e, component, currentPath);
        }}
        className={classNames(previewMode && 'form-fields')}
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
          previewMode={previewMode}
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
            {!previewMode && (
              <DropZone
                data={{
                  path: currentPath,
                  childrenCount: layout.length
                }}
                onDrop={handleDrop}
                path={currentPath}
              />
            )}
            {renderComponent(component, currentPath, renderRow)}
          </React.Fragment>
        );
      })}
      {!previewMode && (
        <DropZone
          data={{
            path: `${layout.length}`,
            childrenCount: layout.length
          }}
          onDrop={handleDrop}
          isLast
        />
      )}
    </>
  );
}
