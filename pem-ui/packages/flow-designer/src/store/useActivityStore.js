import { create } from 'zustand';
import { TASK_INITIAL_NODES } from '../constants';

const activityStore = (set, get) => ({
  activities: {
    taskNodes: TASK_INITIAL_NODES,
    taskEdges: []
  },
  // Task Flow States
  addTaskNodes: (activity) => {
    set((state) => ({
      activities: { taskNodes: state.activities.taskNodes.concat(activity), taskEdges: state.activities.taskEdges }
    }));
  },
  editTaskNodePros: (activity, props, value) => {
    set((state) => {
      const copyNodes = state.activities.taskNodes;
      copyNodes.map((copyNode) => {
        if (activity.id === copyNode.id) {
          copyNode.data[props] = value;
        }
        return copyNode;
      });
      return { activities: { taskNodes: copyNodes, taskEdges: state.activities.taskEdges } };
    });
  },

  // Dialog Flow States
  addDialogNodes: (taskNode, dialogNode) => {
    set((state) => {
      const taskNodeData = state.activities.taskNodes.map((node) => {
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
      return { activities: { taskNodes: taskNodeData, taskEdges: state.activities.taskEdges } };
    });
  },
  editDialogNodePros: (activity, taskNode, props, value) => {
    set((state) => {
      const copyNodes = state.activities.taskNodes;
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
      return { activities: { taskNodes: copyNodes, taskEdges: state.activities.taskEdges } };
    });
  },
  issueActivity: (id) => {
    const activities = get().activities;
    const updatedActivities = activities?.map((activity) => {
      if (activity.id === id) {
        return {
          ...activity,
          status: 'issued'
        };
      } else {
        return activity;
      }
    });
    set((state) => ({
      activities: updatedActivities
    }));
  },
  returnActivity: (id) => {
    const activities = get().activities;
    const updatedActivities = activities?.map((activity) => {
      if (activity.id === id) {
        return {
          ...activity,
          status: 'available'
        };
      } else {
        return activity;
      }
    });
    set((state) => ({
      activities: updatedActivities
    }));
  },
  reset: () => {
    set({
      activities: {
        taskNodes: TASK_INITIAL_NODES,
        taskEdges: []
      }
    });
  }
});

const useActivityStore = create(activityStore);

export default useActivityStore;
