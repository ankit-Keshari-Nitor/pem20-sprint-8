import { create } from 'zustand';
import { TASK_INITIAL_NODES } from '../constants/store-constants';

const taskStore = (set, get) => ({
  tasks: {
    taskNodes: [],
    taskEdges: []
  },
  // Task Flow States
  addTaskNodes: (activity) => {
    set((state) => ({
      tasks: { taskNodes: state.tasks.taskNodes.concat(activity), taskEdges: state.tasks.taskEdges }
    }));
  },
  editTaskNodePros: (activity, props, value) => {
    set((state) => {
      const copyNodes = state.tasks.taskNodes;
      copyNodes.map((copyNode) => {
        if (activity.id === copyNode.id) {
          copyNode.data[props] = value;
        }
        return copyNode;
      });
      return { tasks: { taskNodes: copyNodes, taskEdges: state.tasks.taskEdges } };
    });
  },

  addTaskEdges: (activity) => {
    set((state) => ({
      tasks: { taskNodes: state.tasks.taskNodes, taskEdges: activity }
    }));
  },

  deleteTaskEdge: (id) => {
    set((state) => ({
      tasks: { taskNodes: state.tasks.taskNodes, taskEdges: state.tasks.taskEdges.filter((edge) => edge.id !== id) }
    }));
  },

  // Dialog Flow States
  addDialogNodes: (taskNode, dialogNode) => {
    set((state) => {
      const taskNodeData = state.tasks.taskNodes.map((node) => {
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
      return { tasks: { taskNodes: taskNodeData, taskEdges: state.tasks.taskEdges } };
    });
  },
  editDialogNodePros: (activity, taskNode, props, value) => {
    set((state) => {
      const copyNodes = state.tasks.taskNodes;
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
      return { tasks: { taskNodes: copyNodes, taskEdges: state.tasks.taskEdges } };
    });
  },

  addDialogEdges: (taskNode, dialogEdge) => {
    set((state) => {
      const taskNodeData = state.tasks.taskNodes.map((node) => {
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
      return { tasks: { taskNodes: taskNodeData, taskEdges: state.tasks.taskEdges } };
    });
  },

  deleteDialogEdge: (taskid, edgeid) => {
    set((state) => {
      const taskNodeData = state.tasks.taskNodes.map((node) => {
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
      return { tasks: { taskNodes: taskNodeData, taskEdges: state.tasks.taskEdges } };
    });
  },

  reset: () => {
    set({
      tasks: {
        taskNodes: TASK_INITIAL_NODES,
        taskEdges: []
      }
    });
  }
});

const useTaskStore = create(taskStore);

export default useTaskStore;
