import { useEventBus } from "./useEventBus";
import { startTransition, useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { useNodesState, useEdgesState, addEdge, useStore } from 'reactflow';


function useNewWorkflowSchema(workflowSchema) {
    let id = 0;
    const getId = () => `dndnode_${id++}`;
    const eventBus = useEventBus();

    const [schema, setSchema] = useState({});

    const initialNodesAndEdges = useMemo(() => {
        let nodes = [],
            edges = [];
        /*if (workflowSchema?.states || workflowSchema?.triggers) {
            ({ nodes, edges } = createNodesFromWorkflowSchema(
                workflowSchema,
                () => { },
                () => { },
                (...args) => {
                    console.log({ args });
                },
                () => { },
                () => { },
            ));
        }*/
        return { nodes, edges };
        //return getLayoutedElements(nodes, edges);
    }, [workflowSchema]);

    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodesAndEdges.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialNodesAndEdges.edges);
    const [currentNodeId, setCurrentNodeId] = useState(null);
    const [prevNodeHandleId, setPrevNodeHandleId] = useState(null);
    const [editNodeId, setEditNodeId] = useState(null);
    const [editBlockType, setEditBlockType] = useState(null);


    const workflowNodeDeleteCallback = useCallback(
        (payload) => {
            const id = payload[0].id;
            setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
            setEdges((prevEdges) => prevEdges.filter((edge) => !(edge.source === id || edge.target === id)));
            startTransition(() => {
                //onNodeRemoved(payload[0]);
            });
        },
        [setEdges, setNodes],
    );


    const workflowEdgeDeleteCallback = useCallback(
        (payload) => {
            const edge = edges.find((e) => e.id === payload.id);
            const { source, nextElementId } = (edge || {});
            if (edge) {
                startTransition(() => {
                    //deleteNodeConnection(source, nextElementId);
                });
            }
            setEdges((prevEdges) => prevEdges.filter((e) => e.id !== payload.id));

            // Set the source handle of previous / source node to be able to connect to the new block
            // setNodes((prevNodes) => {
            //     return prevNodes.map((pn) => {
            //         if (pn.id === source) {
            //             const sourceHandleIndex = pn.data.sourceHandles.findIndex((sh) => sh.handleId === payload.id);
            //             if (sourceHandleIndex > -1) {
            //                 return produce(pn, (draftState) => {
            //                     // so we found the source hanlde and changed isConnected to false
            //                     draftState.data.sourceHandles[sourceHandleIndex].isConnected = false;
            //                 });
            //             }
            //         }
            //         return pn;
            //     });
            // });
        },
        [edges, setEdges, setNodes],//deleteNodeConnection
    );

    const workflowEdgeConnectedCallback = useCallback(
        (payload) => {
            const { source, sourceHandle, target } = payload;
            const node = nodes.find((e) => e.id === source);
            // const nextId = node.data?.sourceHandles?.find((sh) => sh.handleId === sourceHandle)?.nextElementId;

            // const updatedBlock = produce(schema?.states[source], (draft) => {
            //     draft.next = draft.next?.map((nxt) => {
            //         if (nextId === nxt.id) {
            //             nxt.next = target;
            //         }
            //         return nxt;
            //     });
            // });

            // const newState = {
            //     states: {
            //         [source]: updatedBlock,
            //     },
            // };

            // eventBus.dispatch("WorkflowSchemaChanged", newState);
        },
        [nodes, schema, eventBus],
    );


    const saveUpdateWorkflow = async () => {
    }
    const saveSchemaCallback = useCallback(async () => {
        await saveUpdateWorkflow();
    }, [saveUpdateWorkflow]);


    const workflowSchemaChangedCallback = useCallback(
        (payload, isSilent = false) => {
        });


    const onEditElementClick = useCallback((element) => {
        const nodeId = element.id;
    });

    useEffect(() => {

        const WorkflowNodeDeleteSubscription = eventBus.on("WorkflowNodeDelete", workflowNodeDeleteCallback);
        const workflowEdgeDeleteSubscription = eventBus.on("WorkflowEdgeDelete", workflowEdgeDeleteCallback);
        const workflowEdgeConnectedSubscription = eventBus.on("WorkflowEdgeConnected", workflowEdgeConnectedCallback);
        const saveSchemaSubscription = eventBus.on("saveSchema", saveSchemaCallback);
        const workflowSchemaChangedSubscription = eventBus.on("WorkflowSchemaChanged", workflowSchemaChangedCallback);
        const workflowEditSubscription = eventBus.on("WorkflowEditClicked", onEditElementClick);

        return () => {
            //unsubscribe event bus subscriptions
            eventBus.unsubscribe("WorkflowNodeDelete", WorkflowNodeDeleteSubscription);
            eventBus.unsubscribe("WorkflowSchemaChanged", workflowSchemaChangedSubscription);
            eventBus.unsubscribe("WorkflowEditClicked", workflowEditSubscription);
            eventBus.unsubscribe("WorkflowEdgeDelete", workflowEdgeDeleteSubscription);
            eventBus.unsubscribe("WorkflowEdgeConnected", workflowEdgeConnectedSubscription);
            eventBus.unsubscribe("saveSchema", saveSchemaSubscription);
        };

    }, []);

    const onConnect = useCallback(
        (params) => {
            setEdges((eds) => addEdge({ ...params, type: "buttonedge" }, eds));
            eventBus.dispatch("WorkflowEdgeConnected", params);
        },
        [setEdges, eventBus]
    );


    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();
            const type = event.dataTransfer.getData('application/reactflow');
            if (typeof type === 'undefined' || !type) {
                return;
            }
            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            const newNode = {
                id: getId(),
                //type,
                position,
                type: 'workflowNode',
                data: { label: `${type}` },
            };
            setNodes((nds) => nds.concat(newNode));
        },
        [getId, reactFlowInstance, setNodes],
    );


    return {
        nodes,
        onNodesChange,
        edges,
        onEdgesChange,
        onDrop,
        onDragOver,
        onConnect,
        editBlockType,
        setReactFlowInstance,
        currentNodeId,
        prevNodeHandleId,
        editNodeId
    };

}