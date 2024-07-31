const Nodes_With_SubProcess = ['SYSTEM', 'CUSTOM', 'SPONSOR', 'PARTNER'];

export const getNodeSpecificDataObj = (node) => {
  console.log(node);
  switch (node.type.toUpperCase()) {
    case 'API':
      return {
        description: node.data.editableProps?.description,
        api: {
          apiConfiguration: 'apiConfiguration',
          url: 'https://jira.com/browse/PEM-273476',
          method: 'GET',
          requestContentType: 'JSON',
          responseContentType: 'JSON',
          file: 'file object',
          headers: '[{"key:"value"}]',
          requestBody: '{"name:"test_name"}',
          sampleResponse: '{"name:"test_name"}',
          responseBody: '{"name:"test_name"}'
        }
      };
    case 'XSLT':
      return {
        description: node.data.editableProps?.description,
        xslt: {
          xslt: '',
          input:'',
          sampleOutput:'',
          output:'',
          escapeInput:false
        }
      };
    case 'PARTNER':
      return {
        description: node.data.editableProps?.description,
        estimateDays: parseInt(node.data.editableProps?.estimate_days),
        userKeys: '',
        roleKeys: node.data.editableProps?.role
      };

    case 'SPONSOR':
      return {
        description: node.data.editableProps?.description,
        estimateDays: node.data.editableProps?.estimate_days,
        userKeys: '',
        roleKeys:  node.data.editableProps?.role,
        showToPartner: true
      };
    case 'SYSTEM':
      return {
        description: node.data.editableProps?.description,
      };
    case 'GATEWAY':
      return {
        description: node.data.editableProps?.description,
        xslt: {
          key: 'value'
        }
      };
    case 'FORM':
      return {
        description: node.data.editableProps?.description,
        userKeys: '',
        roleKeys: '',
        form: {
          key: 'value'
        }
      };
    case 'ATTRIBUTE':
    case 'APPROVAL':
    case 'CUSTOM':
      return {};
    default:
      return {};
  }
};

/*source node id
const getExitConditions = (nodeId, originalNodes) => {
  const node = originalNodes.find((x) => x.id === nodeId);
  return {
    condition: node.data.validateExitValidationQuery,
    errorMessage: node.data.exitValidationMessage
  };
};

const getEntryConditions = (nodeId, originalNodes) => {
  const node = originalNodes.find((x) => x.id === nodeId);
  return {
    condition: node.data.validateEntryValidationQuery,
    errorMessage: node.data.entryValidationMessage
  };
};*/

export const generateNodeEdgesForApi = (nodes, edges) => {
  const nodesData = nodes.map((node, index) => {
    const nodeObj = {
      id: node.id ? node.id : `${node.type}-${index}`,
      name: ["END","START"].includes(node.type) ? `${node.data.taskName}_${index}` : node.data.editableProps?.name,
      type: node.type,
      diagram: {
        x: node.position.x,
        y: node.position.y
      },
      nodes: [],
      connectors: []
    };

    const nodeSpecificData = getNodeSpecificDataObj(node);

    if (Nodes_With_SubProcess.includes(node.type.toUpperCase())) {
      if (node.data.dialogNodes) {
        const subProcessData = generateNodeEdgesForApi(node.data.dialogNodes, node.data.dialogEdges);
        nodeObj.nodes = subProcessData.nodes;
        nodeObj.connectors = subProcessData.edges;
      }
    }
    return { ...nodeObj, ...nodeSpecificData };
  });

  const edgesData = edges.map((x) => {
    //const entryCondition = getEntryConditions(x.target, nodes);
    const condition = "";//getExitConditions(x.source, nodes);

    return {
      id: x.id,
      source: x.source,
      target: x.target,
      condition,
      diagram: []
    };
  });
  return {
    edges: edgesData,
    nodes: nodesData
  };
};
