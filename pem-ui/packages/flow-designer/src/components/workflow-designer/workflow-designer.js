import React, { useState, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { addEdge, useNodesState, useEdgesState } from 'reactflow';
import './workflow-designer.scss';
import PageDesigner from '@b2bi/page-designer';
import componentMapper from '@b2bi/carbon-mappers';
import { DialogFlowDesigner, TaskFlowDesigner } from '../flow-designers';
import {
  connectionLineStyle,
  defaultViewport,
  snapGrid,
  endMarks,
  TASK_NODE_TYPES,
  TASK_EDGE_TYPES,
  TASK_INITIAL_NODES,
  DIALOG_INITIAL_NODES,
  INITIAL_EDGES,
  DIALOG_NODE_TYPES,
  DIALOG_EDGE_TYPES,
  NODE_TYPE
} from '../../constants';
import { useEffect } from 'react';
import useTaskStore from '../../store';
import { Column, Grid } from '@carbon/react';
import { CrossIcon } from '../../icons';
import { Edit } from '@carbon/icons-react';

let dialogId = 0;
const getNewDialogId = () => `Dialog_Name_${dialogId++}`;

let taskId = 0;
const getNewTaskId = () => `Task_Name_${taskId++}`;

const WorkFlowDesigner = forwardRef(
  (
    {
      showActivityDefineDrawer,
      setShowActivityDefineDrawer,
      updateActivityDetails, //updates activity basic details and version specific details to web/activity-store
      updateActivitySchema, //update activity schema - nodes & edges to web/activity-store
      activityDefinitionData, //local state variable from web/activity-definition page
      activityOperation, //mode of operation - new/view/edit
      readOnly, //readonly mode flag
      onVersionSelection, //on version change callback for web/activity-definition page to load version specific data
      versionData, //array of all versions of current activity
      selectedVersion //current selected version
    },
    ref
  ) => {
    //-------------------------------- State Management -------------------------------------
    const store = useTaskStore();
    const storeData = useTaskStore((state) => state.tasks);
    const [isDialogFlowActive, setIsDialogFlowActive] = useState(false);
    const [isPageDesignerActive, setIsPageDesignerActive] = useState(false);

    // --------------------------------- Task Flow States -----------------------------------
    const taskFlowWrapper = useRef(null);
    const [openTaskPropertiesBlock, setOpenTaskPropertiesBlock] = useState();
    const [nodes, setTaskNodes, onTaskNodesChange] = useNodesState([]);
    const [edges, setTaskEdges, onTaskEdgesChange] = useEdgesState([]);
    const [taskFlowInstance, setTaskFlowInstance] = useState(null);
    const [selectedTaskNode, setSelectedTaskNode] = useState(null);

    // --------------------------------- Dialog Flow States -----------------------------------
    const dialogFlowWrapper = useRef(null);
    const [openDialogPropertiesBlock, setOpenDialogPropertiesBlock] = useState(false);
    const [dialogNodes, setDialogNodes, onDialogNodesChange] = useNodesState([]);
    const [dialogEdges, setDialogEdges, onDialogEdgesChange] = useEdgesState([]);
    const [dialogFlowInstance, setDialogFlowInstance] = useState(null);
    const [selectedDialogNode, setSelectedDialogNode] = useState(null);

    /*    // Initializing the Dialog Flow Nodes and Edges
    // -------------------------------- Form Layout --------------------------------------------
    const [formFields, setFormFields] = useState();

    const handleRest = () => {
      store.reset();
    };

    useImperativeHandle(ref, () => {
      return {
        handleRest
      };
    });

    useEffect(() => {
      return () => {
        store.reset();
      };
    }, [store.reset]);

    // Initializing the Dialog Flow Nodes and Edges
    useEffect(() => {
      if (selectedTaskNode) {
        const dialogNodeData = storeData.nodes.filter((node) => node.id === selectedTaskNode.id)[0];
        setDialogNodes(dialogNodeData?.data?.dialogNodes);
        setDialogEdges(dialogNodeData?.data?.dialogEdges);
      }
      //this is sending the new schema to web page  - activity-definition.js
      //updateActivitySchema(storeData);
    }, [setDialogEdges, storeData, selectedTaskNode, updateActivitySchema, setDialogNodes]);*/

    // Initializing the Task Flow Nodes and Edges
    useEffect(() => {
      const instanceNodes = taskFlowInstance ? taskFlowInstance.getNodes() : storeData.nodes;
      const instanceEdges = taskFlowInstance ? taskFlowInstance.getEdges() : storeData.edges;

      setTaskEdges(instanceEdges);
      if (taskFlowInstance) {
        const newNodes = storeData.nodes.map((node) => {
          const n = instanceNodes.find((x) => x.id === node.id);
          return { ...node, position: n ? n.position : node.position };
        });
        setTaskNodes(newNodes);
      }

      setTimeout(() => {
        //this is sending the new schema to web page  - activity-definition.js
        updateActivitySchema({ nodes, edges });
      }, 200);
    }, [setTaskNodes, setTaskEdges, storeData, updateActivitySchema]);

    const deleteNode = (id, isdialog) => {
      const newNodes = taskFlowInstance.getNodes().filter((n) => n.id !== id);
      setTaskNodes(newNodes);
      store.setTaskNOdes(newNodes);
      updateActivitySchema({ nodes: newNodes, edges: storeData.edges });
    };
    const onNodeContextOptionClick = (id, mode, isdialog) => {
      switch (mode.toUpperCase()) {
        case 'DELETE':
          deleteNode(id, isdialog);
          break;
        case 'CLONE':
          alert('Clone operation is in progress');
          break;
        default:
          alert(`${mode} is to be implemented`);
      }
    };

    useEffect(() => {
      console.log(activityDefinitionData);
      store.reset();
      if (activityDefinitionData.schema.nodes.length === 0 || activityDefinitionData.schema.edges.length === 0) {
        setTaskNodes(TASK_INITIAL_NODES);
        setTaskEdges(INITIAL_EDGES);
        store.addTaskNodes(TASK_INITIAL_NODES);
        store.addTaskEdges(INITIAL_EDGES);
      } else {
        setTaskNodes(activityDefinitionData.schema.nodes);
        setTaskEdges(activityDefinitionData.schema.edges);
        store.addTaskNodes(activityDefinitionData.schema.nodes);
        store.addTaskEdges(activityDefinitionData.schema.edges);
      }
    }, [activityDefinitionData]);

    //#region Dialog Block Methods
    const onDialogNodeDragOver = useCallback((event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDialogNodeDrop = useCallback(
      (event) => {
        event.preventDefault();

        const nodeData = JSON.parse(event.dataTransfer.getData('application/nodeData'));

        // check if the dropped element is valid
        if (typeof nodeData === 'undefined' || !nodeData) {
          return;
        }
        if (!nodeData.active) {
          alert('Block not supported yet to use');
          return;
        }

        // Get the position of the dialog
        const position = dialogFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY
        });

        const newDialog = {
          id: getNewDialogId(),
          position,
          type: nodeData.type,
          data: { ...nodeData, onContextMenuClick: (id, menu) => onNodeContextOptionClick(id, menu, true) }
        };
        if (dialogFlowInstance) {
          dialogFlowInstance.addNodes(newDialog);
        }

        store.addDialogNodes(selectedTaskNode, newDialog);
      },
      [store.addDialogNodes, dialogFlowInstance, selectedTaskNode]
    );

    const onDialogNodeConnect = useCallback(
      (params) => {
        let newParam = params;
        newParam.id = `${params.source}_to_${params.target}`;
        newParam.type = 'crossEdge';
        newParam.markerEnd = endMarks;
        newParam.data = { readOnly: readOnly };
        if (dialogFlowInstance) {
          dialogFlowInstance.addEdges({ ...newParam, style: { stroke: '#000' } });
          if (!readOnly) {
            store.addDialogEdges(selectedTaskNode, addEdge({ ...newParam, style: { stroke: '#000' } }, dialogEdges));
          }
        }
        /// newParam.data = selectedTaskNode?.id;//incoming change
      },
      [store.addDialogEdges, dialogEdges, selectedTaskNode, dialogFlowInstance]
    );

    const onDialogNodeClick = (event, node) => {
      if (node.type === NODE_TYPE.DIALOG || node.type === NODE_TYPE.XSLT || node.type === NODE_TYPE.API || node.type === NODE_TYPE.GATEWAY) {
        let copyNodes = dialogNodes;
        copyNodes.map((copyNode) => {
          if (node.id === copyNode.id) {
            switch (node.type) {
              case NODE_TYPE.DIALOG:
                copyNode.data.borderColor = '#D21CF0';
                break;
              case NODE_TYPE.XSLT:
                copyNode.data.borderColor = '#FF611D';
                break;
              case NODE_TYPE.API:
                copyNode.data.borderColor = '#3FBA13';
                break;
              default:
                break;
            }
          } else {
            copyNode.data.borderColor = '#0585FC';
          }
          return copyNode;
        });
        const formData = node.data.form.length ? JSON.parse(node.data.form).fields : [];
        setDialogNodes([...copyNodes]);
        setSelectedDialogNode(node);
        setFormFields(formData);
        setOpenDialogPropertiesBlock(true);
      }
    };

    const onDialogNodeDoubleClick = (event, node) => {
      if (node.type === NODE_TYPE.DIALOG) {
        setIsPageDesignerActive(true);
      }
    };
    //#endregion

    //#region Task Flow Methods
    const onTaskNodeDragOver = useCallback((event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    }, []);

    const onTaskNodeDrop = useCallback(
      (event) => {
        event.preventDefault();

        const nodeData = JSON.parse(event.dataTransfer.getData('application/nodeData'));

        // check if the dropped element is valid
        if (typeof nodeData === 'undefined' || !nodeData) {
          return;
        }

        if (!nodeData.active) {
          alert(`${nodeData.type} task can not be used.`);
          return;
        }

        // Get the position of the task
        const position = taskFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY
        });

        const id = getNewTaskId();
        const newTask = {
          id: id,
          position,
          type: nodeData.type,
          data: { ...nodeData, onContextMenuClick: (id, menu) => onNodeContextOptionClick(id, menu, false), dialogNodes: DIALOG_INITIAL_NODES, dialogEdges: INITIAL_EDGES }
        };
        newTask.data.dialogEdges[0].data.id = id;
        if (taskFlowInstance) {
          taskFlowInstance.addNodes(newTask);
        }
        store.addTaskNodes(newTask);

        updateActivitySchema(storeData);
      },
      [store.addTaskNodes, taskFlowInstance]
    );

    const onTaskNodeConnect = useCallback(
      (params) => {
        let newParam = params;
        newParam.id = `${params.source}_to_${params.target}`;
        newParam.type = 'crossEdge';
        newParam.markerEnd = endMarks;
        newParam.data = { readOnly: readOnly };

        if (taskFlowInstance) {
          taskFlowInstance.addEdges({ ...newParam, style: { stroke: '#000' } });
          if (!readOnly) {
            store.addTaskEdges(addEdge({ ...newParam, style: { stroke: '#000' } }, taskFlowInstance.getEdges()));
            updateActivitySchema(storeData);
          }
        }
      },

      [store.addTaskEdges, taskFlowInstance]
    );

    const onTaskNodeClick = (event, node) => {
      if (
        node.type === NODE_TYPE.PARTNER ||
        node.type === NODE_TYPE.APPROVAL ||
        node.type === NODE_TYPE.ATTRIBUTE ||
        node.type === NODE_TYPE.SPONSOR ||
        node.type === NODE_TYPE.CUSTOM ||
        node.type === NODE_TYPE.SYSTEM ||
        node.type === NODE_TYPE.GATEWAY
      ) {
        let copyNodes = nodes;
        copyNodes.map((copyNode) => {
          if (node.id === copyNode.id) {
            copyNode.data.borderColor = '#023FB2';
          } else {
            copyNode.data.borderColor = '#0585FC';
          }
          return copyNode;
        });
        setTaskNodes([...copyNodes]);
        setSelectedTaskNode(node);
        setOpenTaskPropertiesBlock(true);
        setShowActivityDefineDrawer(false);
      }
    };

    const onTaskNodeDoubleClick = (event, node) => {
      if (node.type === NODE_TYPE.PARTNER || node.type === NODE_TYPE.SPONSOR || node.type === NODE_TYPE.CUSTOM || node.type === NODE_TYPE.SYSTEM) {
        setDialogNodes(node.data.dialogNodes);
        setDialogEdges(node.data.dialogEdges);
        setTimeout(() => {
          setIsDialogFlowActive(true);
        }, 200);
      }
    };
    //#endregion

    const onClickPageDesignerBack = () => {
      setDialogNodes([]);
      setDialogEdges([]);
      setIsDialogFlowActive(true);
      setIsPageDesignerActive(false);
    };

    const onClickDialogFlowBack = () => {
      setDialogNodes([]);
      setDialogEdges([]);
      setIsDialogFlowActive(false);
      setIsPageDesignerActive(false);
    };
    // Save temporary Form data to Session Storage
    const saveFormDesignerData = (layout) => {
      store.addFormLayout(selectedTaskNode, selectedDialogNode, layout);
      // const formDesignerSessionData = JSON.parse(sessionStorage.getItem('formDesignerSessionData'));
      // const newDialog = {
      //   key: 'dialog-1',
      //   name: 'Dialog',
      //   schema: { fields: [...layout] }
      // };
      // if (formDesignerSessionData) {
      //   formDesignerSessionData.unshift(newDialog);
      //   sessionStorage.setItem('formDesignerSessionData', JSON.stringify(formDesignerSessionData));
      // } else {
      //   sessionStorage.setItem('formDesignerSessionData', JSON.stringify([newDialog]));
      // }
    };

    return (
      <>
        {isPageDesignerActive ? (
          <DndProvider debugMode={true} backend={HTML5Backend}>
            <PageDesigner.Designer
              componentMapper={componentMapper}
              onClickPageDesignerBack={onClickPageDesignerBack}
              activityDefinitionData={activityDefinitionData}
              saveFormDesignerData={saveFormDesignerData}
              formFields={formFields}
            />
          </DndProvider>
        ) : (
          <>
            <div className="work-flow-designer">
              <Grid fullWidth>
                <Column lg={4} className="title-container">
                  <span
                    className="header-title"
                    onClick={() => {
                      setOpenTaskPropertiesBlock(false);
                      setShowActivityDefineDrawer(true);
                    }}
                  >
                    {activityDefinitionData && activityDefinitionData.definition?.name} <Edit style={{ color: '#0f62fe' }} />
                  </span>
                </Column>
                {isDialogFlowActive && (
                  <Column lg={12} className="buttons-container">
                    <span onClick={onClickDialogFlowBack} className="cross-icon">
                      <CrossIcon />
                    </span>
                  </Column>
                )}
              </Grid>
              {isDialogFlowActive ? (
                <DialogFlowDesigner
                  connectionLineStyle={connectionLineStyle}
                  defaultViewport={defaultViewport}
                  snapGrid={snapGrid}
                  dialogFlowWrapper={dialogFlowWrapper}
                  dialogNodes={dialogNodes}
                  dialogEdges={dialogEdges}
                  onDialogNodesChange={onDialogNodesChange}
                  onDialogEdgesChange={onDialogEdgesChange}
                  dialogFlowInstance={dialogFlowInstance}
                  setDialogFlowInstance={setDialogFlowInstance}
                  onDialogNodeConnect={onDialogNodeConnect}
                  onDialogNodeDrop={onDialogNodeDrop}
                  onDialogNodeDragOver={onDialogNodeDragOver}
                  onDialogNodeDoubleClick={onDialogNodeDoubleClick}
                  onDialogNodeClick={onDialogNodeClick}
                  DIALOG_NODE_TYPES={DIALOG_NODE_TYPES}
                  DIALOG_EDGE_TYPES={DIALOG_EDGE_TYPES}
                  selectedDialogNode={selectedDialogNode}
                  selectedTaskNode={selectedTaskNode}
                  openDialogPropertiesBlock={openDialogPropertiesBlock}
                  setOpenDialogPropertiesBlock={setOpenDialogPropertiesBlock}
                  readOnly={readOnly}
                />
              ) : (
                activityDefinitionData && (
                  <TaskFlowDesigner
                    connectionLineStyle={connectionLineStyle}
                    defaultViewport={defaultViewport}
                    snapGrid={snapGrid}
                    taskFlowWrapper={taskFlowWrapper}
                    nodes={nodes}
                    edges={edges}
                    onTaskNodesChange={onTaskNodesChange}
                    onTaskEdgesChange={onTaskEdgesChange}
                    taskFlowInstance={taskFlowInstance}
                    setTaskFlowInstance={setTaskFlowInstance}
                    onTaskNodeConnect={onTaskNodeConnect}
                    onTaskNodeDrop={onTaskNodeDrop}
                    onTaskNodeDragOver={onTaskNodeDragOver}
                    onTaskNodeClick={onTaskNodeClick}
                    TASK_NODE_TYPES={TASK_NODE_TYPES}
                    TASK_EDGE_TYPES={TASK_EDGE_TYPES}
                    selectedTaskNode={selectedTaskNode}
                    openTaskPropertiesBlock={openTaskPropertiesBlock}
                    setOpenTaskPropertiesBlock={setOpenTaskPropertiesBlock}
                    showActivityDefineDrawer={showActivityDefineDrawer}
                    setShowActivityDefineDrawer={setShowActivityDefineDrawer}
                    updateActivityDetails={updateActivityDetails}
                    activityDefinitionData={activityDefinitionData}
                    activityOperation={activityOperation}
                    readOnly={readOnly}
                    onVersionSelection={onVersionSelection}
                    onTaskNodeDoubleClick={onTaskNodeDoubleClick}
                    versionData={versionData}
                    selectedVersion={selectedVersion}
                  />
                )
              )}
            </div>
          </>
        )}
      </>
    );
  }
);

export default WorkFlowDesigner;
