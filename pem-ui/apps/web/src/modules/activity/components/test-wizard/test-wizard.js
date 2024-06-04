import React from 'react';
import FormPreview from '../../../../../../../packages/page-designer/src/components/preview-mode';
import componentMapper from './../../../../../../../packages/carbon-mappers/src/index';
import { Row } from '../../../../../../../packages/page-designer/src/elements';

export default function TestWizard({ currentTestData, formRenderSchema }) {
  const renderRow = (row, currentPath, renderRow, previewMode, onChangeHandle) => {
    return (
      <Row
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
      <FormPreview layout={formRenderSchema} componentMapper={componentMapper} renderRow={renderRow} buttonView={false} />
    </div>
  );
}
