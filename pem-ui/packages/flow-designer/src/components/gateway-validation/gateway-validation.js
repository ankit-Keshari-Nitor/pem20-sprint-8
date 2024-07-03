import React from 'react';
import ConditionalBuilder from '../condition-builder';

export default function GatewayValidation({ readOnly, selectedNode, selectedTaskNode }) {
  console.log('selectedNode', selectedNode);
  console.log('selectedTaskNode', selectedTaskNode);
  const onGatewayValidation = (query) => {
    console.log('query', query);
  };
  return <ConditionalBuilder setOpenCancelDialog={() => console.log('Cancel')} onSubmitExitValidationForm={onGatewayValidation} readOnly={readOnly} />;
}
