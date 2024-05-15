/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import ReactFlow, { ReactFlowProvider, Controls, Background } from 'reactflow';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import 'reactflow/dist/style.css';
import './style.scss';

import BlocksTray from '../blocks-tray';
import { CATEGORY_TYPES } from '../../constants';
import BlockPropertiesTray from '../block-properties-tray/block-properties-tray';

const DialogFlowDesigner = ({
  connectionLineStyle,
  defaultViewport,
  snapGrid,
  dialogFlowWrapper,
  dialogNodes,
  dialogEdges,
  onDialogNodesChange,
  onDialogEdgesChange,
  setDialogFlowInstance,
  onDialogNodeConnect,
  onDialogNodeDrop,
  onDialogNodeDragOver,
  onDialogNodeClick,
  DIALOG_NODE_TYPES,
  DIALOG_EDGE_TYPES,
  openDialogPropertiesBlock,
  selectedDialogNode,
  setOpenDialogPropertiesBlock
}) => {
  return (
    <div className="dnd-flow">
      <PanelGroup direction="horizontal">
        <Panel minSize={30} maxSize={80}>
          <div className="dnd-flow">
            {/* Tasks Block */}
            <div className="task-tray-container">
              <BlocksTray category={CATEGORY_TYPES.DIALOG} />
            </div>
            {/* Flow Designer Block  */}
            <ReactFlowProvider>
              <div className="reactflow-wrapper" ref={dialogFlowWrapper}>
                <ReactFlow
                  nodes={dialogNodes}
                  edges={dialogEdges}
                  onNodesChange={onDialogNodesChange}
                  onEdgesChange={onDialogEdgesChange}
                  onConnect={onDialogNodeConnect}
                  onDrop={onDialogNodeDrop}
                  onDragOver={onDialogNodeDragOver}
                  onNodeClick={onDialogNodeClick}
                  nodeTypes={DIALOG_NODE_TYPES}
                  edgeTypes={DIALOG_EDGE_TYPES}
                  onInit={setDialogFlowInstance}
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
        {openDialogPropertiesBlock && (
          <>
            <PanelResizeHandle />
            <Panel defaultSize={40} minSize={20} maxSize={70}>
              <div className="dnd-flow">
                <div className="task-activity-container">
                  <BlockPropertiesTray selectedNode={selectedDialogNode} setOpenPropertiesBlock={setOpenDialogPropertiesBlock} />
                </div>
              </div>
            </Panel>
          </>
        )}
      </PanelGroup>
    </div>
  );
};

export default DialogFlowDesigner;
