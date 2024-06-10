import { create } from 'zustand';
import { ACTIVITY_DEFINITION_DATA } from '../constants';

const activityStore = (set, get) => ({
  activities: {
    definition: {},
    schema: {}
  },
  // Activity Flow State
  editDefinitionProps: (activity) => {
    set((state) => {
      const copyNodes = ACTIVITY_DEFINITION_DATA;
      Object.keys(copyNodes).map((key) => {
        if (activity[key]) {
          copyNodes[key] = activity[key];
        }
        return copyNodes;
      });
      return { activities: { definition: copyNodes, schema: state.activities.schema } };
    });
  },
  editSchemaProps: (task) => {
    set((state) => {
      console.log('updating>>>', { activities: { definition: state.activities.definition, schema: { task } } });
      return { activities: { definition: state.activities.definition, schema: { ...task } } };
    });
  },
  reset: () => {
    set({
      activities: {
        definition: {},
        schema: []
      }
    });
  }
});

const useActivityStore = create(activityStore);

export default useActivityStore;
