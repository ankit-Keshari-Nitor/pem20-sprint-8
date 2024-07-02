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
  DIALOG_INITIAL_NODES,
  DIALOG_NODE_TYPES,
  DIALOG_EDGE_TYPES,
  NODE_TYPE
} from '../../constants';
import { useEffect } from 'react';
import useTaskStore from '../../store';
import { Column, Grid } from '@carbon/react';
import { CrossIcon } from '../../icons';

let dialogId = 0;
const getNewDialogId = () => `Dialog_Name_${dialogId++}`;

let taskId = 0;
const getNewTaskId = () => `Task_Name_${taskId++}`;

const WorkFlowDesigner = forwardRef(
  (
    {
      showActivityDefineDrawer,
      setShowActivityDefineDrawer,
      editDefinitionProp,
      editSchemaProp,
      activityDefinitionData,
      activityOperation,
      readOnly,
      onVersionSelection,
      versionData,
      selectedVersion
    },
    ref
  ) => {
    //-------------------------------- State Management -------------------------------------
    const storeData = useTaskStore((state) => state.tasks);
    const addTaskNode = useTaskStore((state) => state.addTaskNodes);
    const addDialogNodes = useTaskStore((state) => state.addDialogNodes);
    const addTaskEdge = useTaskStore((state) => state.addTaskEdges);
    const addDialogEdge = useTaskStore((state) => state.addDialogEdges);
    const restStore = useTaskStore((state) => state.reset);
    const [isDialogFlowActive, setIsDialogFlowActive] = useState(false);
    const [isPageDesignerActive, setIsPageDesignerActive] = useState(false);

    // --------------------------------- Task Flow States -----------------------------------
    const [openTaskPropertiesBlock, setOpenTaskPropertiesBlock] = useState();
    const taskFlowWrapper = useRef(null);
    const [taskNodes, setTaskNodes, onTaskNodesChange] = useNodesState(storeData.taskNodes);
    const [taskEdges, setTaskEdges, onTaskEdgesChange] = useEdgesState([]);
    const [taskFlowInstance, setTaskFlowInstance] = useState(null);
    const [selectedTaskNode, setSelectedTaskNode] = useState(null);

    // --------------------------------- Dialog Flow States -----------------------------------
    const [openDialogPropertiesBlock, setOpenDialogPropertiesBlock] = useState(false);
    const dialogFlowWrapper = useRef(null);
    const [dialogNodes, setDialogNodes, onDialogNodesChange] = useNodesState([]);
    const [dialogEdges, setDialogEdges, onDialogEdgesChange] = useEdgesState([]);
    const [dialogFlowInstance, setDialogFlowInstance] = useState(null);
    const [selectedDialogNode, setSelectedDialogNode] = useState(null);

    // --------------------------------- Dialog Flow Methods -----------------------------------
    const onDialogNodeDoubleClick = (event, node) => {
      if (node.type === NODE_TYPE.DIALOG) {
        setIsPageDesignerActive(true);
      }
    };

    const handleRest = () => {
      restStore();
    };

    useImperativeHandle(ref, () => {
      return {
        handleRest
      };
    });

    const onDialogNodeConnect = useCallback(
      (params) => {
        let newParam = params;
        newParam.type = 'crossEdge';
        newParam.markerEnd = endMarks;
        newParam.data = { id: selectedTaskNode?.id };
        /// newParam.data = selectedTaskNode?.id;//incoming change
        addDialogEdge(selectedTaskNode, addEdge({ ...newParam, style: { stroke: '#000' } }, dialogEdges));
      },
      [addDialogEdge, dialogEdges, selectedTaskNode]
    );

    const onDialogNodeDragOver = useCallback((event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    }, []);

    /*  useEffect(() => {
    setOpenTaskPropertiesBlock(showActivityDefineDrawer);
  }, [showActivityDefineDrawer]);*/

    useEffect(() => {
      if (storeData.taskNodes.length === 0) {
        restStore();
      }
    }, [restStore, storeData]);

    useEffect(() => {
      setTaskNodes(storeData.taskNodes);
      setTaskEdges(storeData.taskEdges);
      if (selectedTaskNode) {
        const dialogNodeData = storeData.taskNodes.filter((node) => node.id === selectedTaskNode.id)[0];
        setDialogNodes(dialogNodeData?.data?.dialogNodes);
        setDialogEdges(dialogNodeData?.data?.dialogEdges);
      }
      //this is sending the new schema to web page  - activity-definition.js
      editSchemaProp(storeData, activityOperation);
    }, [setTaskNodes, setTaskEdges, setDialogEdges, storeData, selectedTaskNode, editSchemaProp, setDialogNodes]);

    const onDialogNodeDrop = useCallback(
      (event) => {
        event.preventDefault();

        const nodeData = JSON.parse(event.dataTransfer.getData('application/nodeData'));

        // check if the dropped element is valid
        if (typeof nodeData === 'undefined' || !nodeData) {
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
          data: { ...nodeData, onDoubleClick: onDialogNodeDoubleClick }
        };

        addDialogNodes(selectedTaskNode, newDialog);
      },
      [addDialogNodes, dialogFlowInstance, selectedTaskNode]
    );

    const onDialogNodeClick = (event, node) => {
      if (node.type === NODE_TYPE.DIALOG || node.type === NODE_TYPE.XSLT || node.type === NODE_TYPE.API) {
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
        setDialogNodes([...copyNodes]);
        setSelectedDialogNode(node);
        setOpenDialogPropertiesBlock(true);
      }
    };

    // --------------------------------- Task Flow Methods -----------------------------------
    const onTaskNodeDoubleClick = (event, node) => {
      if (node.type === NODE_TYPE.PARTNER || node.type === NODE_TYPE.SPONSOR || node.type === NODE_TYPE.CUSTOM || node.type === NODE_TYPE.SYSTEM) {
        setIsDialogFlowActive(true);
      }
    };

    const onTaskNodeConnect = useCallback(
      (params) => {
        let newParam = params;
        newParam.type = 'crossEdge';
        newParam.markerEnd = endMarks;
        newParam.data = { readOnly: readOnly };
        !readOnly && addTaskEdge(addEdge({ ...newParam, style: { stroke: '#000' } }, storeData.taskEdges));
      },
      [addTaskEdge, storeData.taskEdges]
    );

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

        // Get the position of the task
        const position = taskFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY
        });

        const newTask = {
          id: getNewTaskId(),
          position,
          type: nodeData.type,
          data: { ...nodeData, onDoubleClick: onTaskNodeDoubleClick, dialogNodes: DIALOG_INITIAL_NODES, dialogEdges: [] }
        };
        addTaskNode(newTask);
      },
      [addTaskNode, taskFlowInstance]
    );

    const onTaskNodeClick = (event, node) => {
      if (
        node.type === NODE_TYPE.PARTNER ||
        node.type === NODE_TYPE.APPROVAL ||
        node.type === NODE_TYPE.ATTRIBUTE ||
        node.type === NODE_TYPE.SPONSOR ||
        node.type === NODE_TYPE.CUSTOM ||
        node.type === NODE_TYPE.SYSTEM
      ) {
        let copyNodes = taskNodes;
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
        setDialogNodes(node.data.dialogNodes);
        setOpenTaskPropertiesBlock(true);
        setShowActivityDefineDrawer(false);
      }
    };

    const onClickPageDesignerBack = () => {
      setIsDialogFlowActive(true);
      setIsPageDesignerActive(false);
    };

    const onClickDialogFlowBack = () => {
      setIsDialogFlowActive(false);
      setIsPageDesignerActive(false);
    };

    // Save temporary Form data to Session Storage
    const saveFormDesignerData = (layout) => {
      const formDesignerSessionData = JSON.parse(sessionStorage.getItem('formDesignerSessionData'));
      const newDialog = {
        key: 'dialog-1',
        name: 'Dialog',
        schema: { fields: [...layout] }
      };
      formDesignerSessionData.unshift(newDialog);
      sessionStorage.setItem('formDesignerSessionData', JSON.stringify(formDesignerSessionData));
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
            />
          </DndProvider>
        ) : (
          <>
            <div className="work-flow-designer">
              <Grid fullWidth>
                <Column lg={4} className="title-container">
                  <span className="header-title" onClick={() => setOpenTaskPropertiesBlock(true)}>
                    {activityDefinitionData && Object.keys(activityDefinitionData).length > 0 ? activityDefinitionData.name : 'New Activity'}
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
                <TaskFlowDesigner
                  connectionLineStyle={connectionLineStyle}
                  defaultViewport={defaultViewport}
                  snapGrid={snapGrid}
                  taskFlowWrapper={taskFlowWrapper}
                  taskNodes={taskNodes}
                  taskEdges={taskEdges}
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
                  editDefinitionProp={editDefinitionProp}
                  activityDefinitionData={activityDefinitionData}
                  activityOperation={activityOperation}
                  readOnly={readOnly}
                  onVersionSelection={onVersionSelection}
                  onTaskNodeDoubleClick={onTaskNodeDoubleClick}
                  versionData={versionData}
                  selectedVersion={selectedVersion}
                />
              )}
            </div>
          </>
        )}
      </>
    );
  }
);

export default WorkFlowDesigner;
