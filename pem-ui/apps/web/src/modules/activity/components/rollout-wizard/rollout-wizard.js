import React from 'react';
import RolloutDetails from './elements/rollout-details-step';
import RolloutGapDetails from './elements/rollout-gap-step';
import RolloutProgressSteps from './elements/rollout-progress-steps';

export default function RolloutWizard({ currentStep, handelStepChange }) {
  return (
    <>
      <RolloutProgressSteps currentStep={currentStep} handelStepChange={handelStepChange} />
      {currentStep === 0 ? <RolloutDetails /> : <RolloutGapDetails />}
    </>
  );
}
