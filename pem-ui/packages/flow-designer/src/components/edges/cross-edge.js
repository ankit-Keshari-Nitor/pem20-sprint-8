import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, useReactFlow } from 'reactflow';
import './style.scss';
import useTaskStore from '../../store';

function CrossEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = { stroke: '#000' }, markerEnd, data }) {
  const { setEdges } = useReactFlow();
  const deleteTaskEdge = useTaskStore((state) => state.deleteTaskEdge);
  const deleteDialogEdge = useTaskStore((state) => state.deleteDialogEdge);
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });

  const onEdgeClick = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
    if (data) {
      deleteDialogEdge(data, id);
    } else {
      deleteTaskEdge(id);
    }
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all'
          }}
          className="nodrag nopan"
        >
          <button className="edge-button" onClick={onEdgeClick}>
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default CrossEdge;
