/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import ReactFlow, { ReactFlowProvider, Controls, Background } from 'reactflow';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import 'reactflow/dist/style.css';
import './style.scss';

import BlocksTray from '../blocks-tray';
import { CATEGORY_TYPES } from '../../constants';
import BlockPropertiesTray from '../block-properties-tray';
import ActivityDefinitionForm from '../activity-definition-form';

const TaskFlowDesigner = ({
  connectionLineStyle,
  defaultViewport,
  snapGrid,
  taskFlowWrapper,
  taskNodes,
  taskEdges,
  onTaskNodesChange,
  onTaskEdgesChange,
  setTaskFlowInstance,
  onTaskNodeConnect,
  onTaskNodeDrop,
  onTaskNodeDragOver,
  onTaskNodeClick,
  onTaskNodeDoubleClick,
  TASK_NODE_TYPES,
  TASK_EDGE_TYPES,
  openTaskPropertiesBlock,
  selectedTaskNode,
  setOpenTaskPropertiesBlock,
  updateActivityDetails,
  activityDefinitionData,
  activityOperation,
  readOnly,
  showActivityDefineDrawer,
  setShowActivityDefineDrawer,
  onVersionSelection,
  versionData,
  selectedVersion
}) => {
  return (
    <div className="dnd-flow">
      <PanelGroup direction="horizontal">
        <Panel minSize={30} maxSize={80}>
          <div className="dnd-flow">
            {/* Tasks Block */}
            <div className="task-tray-container">
              <BlocksTray category={CATEGORY_TYPES.TASK} readOnly={readOnly} />
            </div>
            {/* Flow Designer Block  */}
            <ReactFlowProvider>
              <div className="reactflow-wrapper" ref={taskFlowWrapper}>
                <ReactFlow
                  nodes={taskNodes}
                  edges={taskEdges}
                  onNodesChange={onTaskNodesChange}
                  onEdgesChange={onTaskEdgesChange}
                  onInit={setTaskFlowInstance}
                  onConnect={onTaskNodeConnect}
                  onDrop={onTaskNodeDrop}
                  onDragOver={onTaskNodeDragOver}
                  onNodeClick={onTaskNodeClick}
                  onNodeDoubleClick={onTaskNodeDoubleClick}
                  nodeTypes={TASK_NODE_TYPES}
                  edgeTypes={TASK_EDGE_TYPES}
                  connectionLineStyle={connectionLineStyle}
                  defaultViewport={defaultViewport}
                  snapGrid={snapGrid}
                >
                  <Background color="#ffffff" variant="dots" />
                  <Controls position="bottom-right" />
                </ReactFlow>
              </div>
            </ReactFlowProvider>
          </div>
        </Panel>
        {openTaskPropertiesBlock && (
          <>
            <PanelResizeHandle />
            <Panel defaultSize={35} minSize={20} maxSize={70}>
              <div className="dnd-flow">
                <div className="task-activity-container">
                  <BlockPropertiesTray
                    selectedNode={selectedTaskNode}
                    setOpenPropertiesBlock={setOpenTaskPropertiesBlock}
                    updateActivityDetails={updateActivityDetails}
                    activityOperation={activityOperation}
                    activityDefinitionData={activityDefinitionData}
                    readOnly={readOnly}
                  />
                </div>
              </div>
            </Panel>
          </>
        )}
        {showActivityDefineDrawer  && (
          <>
          <PanelResizeHandle />
          <Panel defaultSize={40} minSize={20} maxSize={70}>
            <div className="dnd-flow">
              <div className="task-activity-container">
                <ActivityDefinitionForm
                  //selectedNode={selectedTaskNode}
                  setOpenPropertiesBlock={setShowActivityDefineDrawer}
                  onVersionSelection={onVersionSelection}
                  updateActivityDetails={updateActivityDetails}
                  activityOperation={activityOperation}
                  activityDefinitionData={activityDefinitionData}
                  readOnly={readOnly}
                  versionData={versionData}
                  selectedVersion={selectedVersion}
                />
              </div>
            </div>
          </Panel>
        </>)
        }
      </PanelGroup>
    </div>
  );
};

export default TaskFlowDesigner;
