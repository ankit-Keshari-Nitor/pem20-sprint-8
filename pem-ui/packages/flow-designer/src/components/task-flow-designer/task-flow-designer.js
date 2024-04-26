/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import ReactFlow, { ReactFlowProvider, Controls, Background } from 'reactflow';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import 'reactflow/dist/style.css';
import './task-flow-designer.scss';

import BlockTray from '../block-tray';
import { CATEGORY_TYPES } from '../../constants';
import BlockPropertiesTray from '../block-properties-tray/block-properties-tray';

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
  TASK_NODE_TYPES,
  TASK_EDGE_TYPES,
  openTaskPropertiesBlock,
  selectedTaskNode,
  setOpenTaskPropertiesBlock
}) => {
  return (
    <div className="dnd-flow">
      <PanelGroup direction="horizontal">
        <Panel minSize={30} maxSize={80}>
          <div className="dnd-flow">
            {/* Tasks Block */}
            <div className="task-tray-container">
              <BlockTray category={CATEGORY_TYPES.TASK} />
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
                  nodeTypes={TASK_NODE_TYPES}
                  edgeTypes={TASK_EDGE_TYPES}
                  connectionLineStyle={connectionLineStyle}
                  defaultViewport={defaultViewport}
                  snapGrid={snapGrid}
                >
                  <Background color="#ccc" variant="dots" />
                  <Controls position="bottom-right" />
                </ReactFlow>
              </div>
            </ReactFlowProvider>
          </div>
        </Panel>
        {openTaskPropertiesBlock && (
          <>
            <PanelResizeHandle />
            <Panel defaultSize={40} minSize={20} maxSize={70}>
              <div className="dnd-flow">
                <div className="task-activity-container">
                  <BlockPropertiesTray selectedNode={selectedTaskNode} setOpenPropertiesBlock={setOpenTaskPropertiesBlock} />
                </div>
              </div>
            </Panel>
          </>
        )}
      </PanelGroup>
    </div>
  );
};

export default TaskFlowDesigner;
