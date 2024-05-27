import { create } from 'zustand';
import { TASK_INITIAL_NODES } from '../constants';

const taskStore = (set, get) => ({
  tasks: {
    taskNodes: TASK_INITIAL_NODES,
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
