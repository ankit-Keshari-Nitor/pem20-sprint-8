import { create } from 'zustand';
import { ACTIVITY_DEFINITION_DATA } from '../constants';

const activityStore = (set, get) => ({
  activities: {
    definition: {},
    schema: {},
    version: [],
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
      return { activities: { definition: copyNodes, schema: state.activities.schema, version: [], operation: operation } };
    });
  },
  editSchemaProps: (task,operation) => {
    set((state) => {
      console.log('updating>>>', { activities: { definition: state.activities.definition, schema: { ...task }, version: [], operation: operation } });
      return { activities: { definition: state.activities.definition, schema: { ...task }, version: [], operation: operation } };
    });
  },
  reset: () => {
    set({
      activities: {
        definition: {},
        schema: {},
        version: [],
        operation: ''
      }
    });
  }
});

const useActivityStore = create(activityStore);

export default useActivityStore;
