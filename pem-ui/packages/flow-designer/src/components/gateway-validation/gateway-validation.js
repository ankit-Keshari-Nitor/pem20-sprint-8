import React, { useEffect, useState } from 'react';
import ConditionalBuilder from '../condition-builder';
import { Select, SelectItem, Grid, Column } from '@carbon/react';
import useTaskStore from '../../store';

export default function GatewayValidation({ readOnly, selectedNode }) {
  const storeData = useTaskStore((state) => state.tasks);
  const [connectedGatewayNodes, setConnectedGatewayNodes] = useState([]);
  const [selectedGatewayNode, setSelectedGatewayNode] = useState();
  const [finalSchema, setFinalSchema] = useState([]);

  useEffect(() => {
    if (storeData && storeData.edges.length > 0 && storeData.nodes.length > 0) {
      const connectedEdges = storeData.edges.filter((edge) => edge.source === selectedNode.id);
      const connectedNodes = getConnectedNodes(storeData.nodes, connectedEdges);
      setConnectedGatewayNodes(connectedNodes);
      setSelectedGatewayNode(connectedNodes && connectedNodes[0].id);
    }
  }, [storeData]);

  const getConnectedNodes = (taskNodes, connectedEdges) => {
    return taskNodes.filter((o1) => {
      return connectedEdges.some((o2) => o2.target === o1.id);
    });
  };

  const updateFinalSchema = (array, element) => {
    const i = array.findIndex((e) => e.id === element.id);
    if (i > -1) array[i] = element;
    else array.push(element);
    return array;
  };

  const onGatewayValidationSubmit = (query, errorMessage) => {
    const updatedSchema = updateFinalSchema(finalSchema, { id: selectedGatewayNode, gatewayQuery: query, gatewayErrorMessage: errorMessage });
    setFinalSchema([...updatedSchema]);
  };

  return (
    <>
      <Grid>
        <Column className="form-field" lg={8}>
          <Select id="connectedNodes-selector" data-testid="connectedNodes-selector" labelText="" onChange={(event) => setSelectedGatewayNode(event.target.value)}>
            {connectedGatewayNodes?.map((connectedGatewayNode) => (
              <SelectItem
                key={connectedGatewayNode.id}
                text={
                  connectedGatewayNode.data.editableProps && connectedGatewayNode.data.editableProps.name ? connectedGatewayNode.data.editableProps.name : connectedGatewayNode.id
                }
                value={connectedGatewayNode.id}
                data-testid={connectedGatewayNode.id}
              />
            ))}
          </Select>
        </Column>
      </Grid>
      <ConditionalBuilder setOpenCancelDialog={() => console.log('Cancel')} onSubmitExitValidationForm={onGatewayValidationSubmit} readOnly={readOnly} />
    </>
  );
}
