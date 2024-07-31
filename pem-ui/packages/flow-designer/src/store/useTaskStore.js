import { create } from 'zustand';
import { TASK_INITIAL_NODES } from '../constants/store-constants';

const taskStore = (set, get) => ({
  tasks: {
    nodes: [],
    edges: []
  },
  // Task Flow States
  addTaskNodes: (activity) => {
    set((state) => ({
      tasks: { nodes: state.tasks.nodes.concat(activity), edges: state.tasks.edges }
    }));
  },
  editTaskNodePros: (activity, props, value) => {
    set((state) => {
      const copyNodes = state.tasks.nodes;
      copyNodes.map((copyNode) => {
        if (activity.id === copyNode.id) {
          copyNode.data[props] = value;
        }
        return copyNode;
      });
      return { tasks: { nodes: copyNodes, edges: state.tasks.edges } };
    });
  },

  addTaskEdges: (edges) => {
    set((state) => ({
      tasks: { nodes: state.tasks.nodes, edges: edges }
    }));
  },

  deleteTaskEdge: (id) => {
    set((state) => ({
      tasks: { nodes: state.tasks.nodes, edges: state.tasks.edges.filter((edge) => edge.id !== id) }
    }));
  },

  // Dialog Flow States
  addDialogNodes: (taskNode, dialogNode) => {
    set((state) => {
      const taskNodeData = state.tasks.nodes.map((node) => {
        if (node.id === taskNode.id) {
          const {
            data: { dialogNodes, ...restdata },
            ...rest
          } = node;
          const newDilogNode = [...dialogNodes, dialogNode];
          return { ...rest, data: { ...restdata, dialogNodes: newDilogNode } };
        } else {
          return node;
        }
      });
      return { tasks: { nodes: taskNodeData, edges: state.tasks.edges } };
    });
  },
  editDialogNodePros: (activity, taskNode, props, value) => {
    set((state) => {
      const copyNodes = state.tasks.nodes;
      copyNodes.map((copyNode) => {
        if (taskNode.id === copyNode.id) {
          const {
            data: { dialogNodes }
          } = copyNode;
          dialogNodes?.map((dialogNodeData) => {
            if (dialogNodeData.id === activity.id) {
              dialogNodeData.data[props] = value;
            }
            return dialogNodeData;
          });
          //return { ...rest, data: { ...restdata, dialogNodes: updatedDialogNodeData } };
        }
        return copyNode;
      });
      return { tasks: { nodes: copyNodes, edges: state.tasks.edges } };
    });
  },

  addDialogEdges: (taskNode, dialogEdge) => {
    set((state) => {
      const taskNodeData = state.tasks.nodes.map((node) => {
        if (node.id === taskNode.id) {
          const {
            data: { dialogEdges, ...restdata },
            ...rest
          } = node;
          const newDilogEdge = dialogEdges.concat(dialogEdge.filter((item2) => !dialogEdges.some((item1) => item1.id === item2.id)));
          return { ...rest, data: { ...restdata, dialogEdges: newDilogEdge } };
        } else {
          return node;
        }
      });
      return { tasks: { nodes: taskNodeData, edges: state.tasks.edges } };
    });
  },

  deleteDialogEdge: (taskid, edgeid) => {
    set((state) => {
      const taskNodeData = state.tasks.nodes.map((node) => {
        if (node.id === taskid) {
          const {
            data: { dialogEdges, ...restdata },
            ...rest
          } = node;
          const newDilogEdge = dialogEdges.filter((edge) => edge.id !== edgeid);
          return { ...rest, data: { ...restdata, dialogEdges: newDilogEdge } };
        } else {
          return node;
        }
      });
      return { tasks: { nodes: taskNodeData, edges: state.tasks.edges } };
    });
  },

  reset: () => {
    set({
      tasks: {
        nodes: TASK_INITIAL_NODES,
        edges: []
      }
    });
  }
});

const useTaskStore = create(taskStore);

export default useTaskStore;
