import React, { useRef, useCallback, useState, useEffect } from 'react';
import { EdgeLabelRenderer, getSmoothStepPath, useReactFlow } from 'reactflow';
import './style.scss';
import useTaskStore from '../../store';

function CrossEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = { stroke: '#000' }, markerEnd, data }) {
  const { setEdges } = useReactFlow();
  const deleteTaskEdge = useTaskStore((state) => state.deleteTaskEdge);
  const deleteDialogEdge = useTaskStore((state) => state.deleteDialogEdge);
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });

  const ref = useRef(null);
  const [buttonDirection, setFlexDirectoin] = useState('row');

  const callBack = useCallback((isEnter) => {
    ref.current?.parentElement.classList[isEnter ? 'add' : 'remove']('animated', 'redlines');
  }, []);

  const onEdgeClick = (edgeId) => {
    setEdges((edges) => edges.filter((edge) => edge.id !== edgeId));
    if (data.id) {
      deleteDialogEdge(data.id, id);
    } else {
      deleteTaskEdge(id);
    }
  };

  useEffect(() => {
    //console.log('targetY',targetY);
    //console.log('souceY',sourceY);
    if (targetY > sourceY) {
      targetY - sourceY < 15 ? setFlexDirectoin('row') : setFlexDirectoin('column');
    } else if (sourceY > targetY) {
      sourceY - targetY < 15 ? setFlexDirectoin('row') : setFlexDirectoin('column');
    }
  }, [sourceY, targetY]);

  return (
    <>
      <path id={'1'} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} ref={ref} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            display: 'flex',
            flexDirection: buttonDirection,
            pointerEvents: 'all'
          }}
          className="nodrag nopan"
        >
          <button
            size="sm"
            className="edge-button remove-edge-button"
            style={{ margin: 2 }}
            disabled={data?.readOnly}
            onClick={() => onEdgeClick(id)}
            onMouseOver={() => callBack(true)}
            onMouseLeave={() => callBack(false)}
          >
            x
          </button>

          <button
            size="sm"
            style={{ margin: 2 }}
            className="edge-button add-block-button"
            disabled={data?.readOnly}
            onClick={() => alert('Add Block to be implemented')}
            onMouseOver={() => callBack(true)}
            onMouseLeave={() => callBack(false)}
          >
            +
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default CrossEdge;
