import React from 'react';
import componentMapper from '@b2bi/carbon-mappers';
import PageDesigner from '@b2bi/page-designer';

export default function TestWizard({ currentTestData, formRenderSchema }) {
  const renderRow = (row, currentPath, renderRow, previewMode, onChangeHandle) => {
    return (
      <PageDesigner.Row
        key={row.id}
        data={row}
        handleDrop={() => console.log('test')}
        path={currentPath}
        componentMapper={componentMapper}
        onFieldSelect={() => console.log('test')}
        renderRow={renderRow}
        onFieldDelete={() => console.log('test')}
        previewMode={previewMode}
        onChangeHandle={() => console.log('test')}
      />
    );
  };

  return (
    <div>
      {currentTestData.name}
      <PageDesigner.FormPreview layout={formRenderSchema} componentMapper={componentMapper} renderRow={renderRow} buttonView={false} />
    </div>
  );
}
