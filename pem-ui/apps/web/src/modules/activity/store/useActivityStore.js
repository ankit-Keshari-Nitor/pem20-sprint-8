import { create } from 'zustand';

const activityStore = (set, get) => ({
  activities: {
    definition: {},
    schema: {}
  },
  // Activity Flow State
  editDefinitionProps: (value) => {
    set((state) => {
      return { activities: { definition: value, schema: state.activities.schema } };
    });
  },
  editSchemaProps: (task) => {
    set((state) => {
        console.log('updating>>>',{ activities: { definition: state.activities.definition, schema: { task } } });
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

const useActivitykStore = create(activityStore);

export default useActivitykStore;
