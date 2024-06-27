import { create } from 'zustand';
import { ACTIVITY_DEFINITION_DATA } from '../constants';


const activityStore = (set, get) => ({
  selectedActivity: {
    actDefName: '',
    activityDefKey: '',
    actDefVerKey: '',
    operation: ''
  },
  activityData: {
    definition: {},
    schema: {},//node+edges+ each node's data(def,exit validation,form design)
    versions: [],
    operation: ''
  },
  // Activity Flow State
  editDefinitionProps: (activity, operation) => {
    set((state) => {
      const copyNodes = ACTIVITY_DEFINITION_DATA;
      Object.keys(copyNodes).map((key) => {
        if (activity[key]) {
          copyNodes[key] = activity[key];
        }
        return copyNodes;
      });

      return {
        activityData: {
          definition: copyNodes,
          schema: state.activityData.schema,
          versions: [],
          operation: operation
        }
      };
    });
  },
  //this changes during - 
  editSchemaProps: (task, operation) => {
    set((state) => {
      console.log('updating>>>', { activityData: { definition: state.activityData.definition, schema: { ...task }, versions: [], operation: operation } });
      return { activityData: { definition: state.activityData.definition, schema: { ...task }, versions: [], operation: operation } };
    });
  },
  setSelectedActivity: ({activityDefKey, actDefName, actDefVerKey, operation}) => {
    set((state) => {
      const selectedActivity = { actDefName, activityDefKey, actDefVerKey, operation };
      return { ...state.activityData, ...selectedActivity };
    });
  },
  reset: () => {
    set({
      activityData: {
        definition: {},
        schema: {},
        versions: [],
        operation: ''
      }
    });
  }
});

const useActivityStore = create(activityStore);

export default useActivityStore;
