import { create } from 'zustand';

const activityStore = (set, get) => ({
  selectedActivity: {
    actDefName: '',
    activityDefKey: '',
    actDefVerKey: '',
    actDefStatus:'',
    operation: '',
    status:'',
    version:''
  },
  activityData: {
    definition: {},
    schema: {},//node+edges+ each node's data(def,exit validation,form design
  },
  // Activity Flow State
  updateActivityDetails: (activity,) => {
    set((state) => {
      return {
        activityData: {
          definition: activity,
          schema: state.activityData.schema
        },
        selectedActivity: state.selectedActivity
      };
    });
  },
  //this changes during - 
  updateActivitySchema: (task) => {
    set((state) => {
      return {
        activityData:{ 
          definition: state.activityData.definition, 
          schema: { ...task }
        },
        selectedActivity: state.selectedActivity
      };
    });
  },
  setSelectedActivity: (currentActivity) => {
   
    set((state) => {
      //const selectedActivity = { actDefName, activityDefKey, actDefVerKey, operation,status,version:`Ver.${version}` };
      return { ...state.activityData,  selectedActivity: currentActivity };
    });
  },
  reset: () => {
    set({
      activityData: {
        definition: {},
        schema: {},
        versions: [],
        operation: ''
      },
      selectedActivity: null
    });
  }
});

const useActivityStore = create(activityStore);

export default useActivityStore;
