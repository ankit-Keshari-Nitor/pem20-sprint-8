import Designer from '@b2bi/flow-designer';
const Nodes_With_SubProcess = ['SYSTEM', 'CUSTOM', 'SPONSOR', 'PARTNER'];

const NODE_DATA = Designer.NODE_TYPES; 
const EDGE_DATA = Designer.INITIAL_EDGES;

export const getNodeSpecificDataObj = (node) => {
  switch (node.type.toUpperCase()) {
    case 'API':
      return {
        description: node.data.editableProps?.description,
        loop: {
          loopCardinality: '',
        },
        api: {
          apiConfiguration: 'apiConfiguration',
          url: 'https://jira.com/browse/PEM-273476',
          method: 'GET',
          requestContentType: 'JSON',
          responseContentType: 'JSON',
          file: 'file object',
          requestHeaders: '[{"key:"value"}]',
          request: '{"name:"test_name"}',
          sampleResponse: '{"name:"test_name"}',
          response: '{"name:"test_name"}'
        }
      };
    case 'XSLT':
      return {
        description: node.data.editableProps?.description,
        xslt: {
          xslt: '',
          input: '',
          sampleOutput: '',
          output: '',
          escapeInput: false
        },
        loop:{
          loopCardinality: '',
          completionCondition: '',
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
        roleKeys: node.data.editableProps?.role,
        showToPartner: node.data.editableProps?.showToPartner
      };
    case 'SYSTEM':
      return {
        description: node.data.editableProps?.description
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
        //userKeys: '',
        //roleKeys: node.data.editableProps?.role,
        form: node.data.form,
        loop: {
          loopDataInput: '',
          dataItem: '',
          completionCondition: ''
        }
      };
    case 'CUSTOM':
      return {
        description: node.data.editableProps?.description,
      };
      case 'ATTRIBUTE':
        case 'APPROVAL':
          return {

          }
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
      name: ['END', 'START'].includes(node.type) ? `${node.data.taskName}_${index}` : node.data.editableProps?.name,
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
    const condition = ''; //getExitConditions(x.source, nodes);

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

const getStartNode = (node) => {
  return {
    id: 'start',
    type: 'START',
    data: {
      taskName: 'Start',
      borderColor: '#0585FC'
    },
    position: {
      x: node.diagram.x,
      y: node.diagram.y
    },
    sourcePosition: 'right'
  };
};
const getEndNode = (node) => {
  return {
    id: 'end',
    type: 'END',
    data: {
      taskName: 'End',
      borderColor: '#0585FC'
    },
    position: {
      x: node.diagram.x,
      y: node.diagram.y
    },
    targetPosition: 'left'
  };
};

export const nodeObjects = (node, readOnly) => {
  switch (node.type.toUpperCase()) {
    case 'START':
      return getStartNode(node);
    case 'END':
      return getEndNode(node);
    case 'PARTNER':
      const data = { ...NODE_DATA[node.type.toUpperCase()] };
      const { nodes, connectors, diagram, id, type, ...rest } = node
      data.editableProps = { name: rest?.name, description: rest?.description, estimate_days: rest?.estimateDays, role: rest?.roleKeys };
      data.dialogNodes = nodes;
      data.dialogEdges = connectors;
      return {
        id: id,
        position: {
          x: diagram.x,
          y: diagram.y
        },
        type: type,
        data: {
          ...data
        }
      };  
    default:
      return {};
  }
};

export const generateActivitySchema = (nodes, edges, readOnly) => {
  const newNodes = nodes.map((node) => {
    return nodeObjects(node, readOnly);
  });

  const newEdges = edges.map((edge) => {

    return {...EDGE_DATA[0], ...edge}
    
    // return {
    //   ...edge,
    //   type: 'crossEdge',

    //   markerEnd: {
    //     type: 'arrowclosed',
    //     width: 20,
    //     height: 20,
    //     color: '#FF0072'
    //   },
    //   data: {
    //     readOnly: readOnly
    //   },
    //   style: {
    //     stroke: '#000'
    //   }
    // };
  });

  return {
    nodes: newNodes,
    edges: newEdges
  };
};
