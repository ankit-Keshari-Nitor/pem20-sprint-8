import React from 'react';
import { ProgressIndicator, ProgressStep } from '@carbon/react';
import { ROLLOUT_STEPS } from '../../../constants';

export default function RolloutProgressSteps({ currentStep, handelStepChange }) {
  return (
    <ProgressIndicator
      currentIndex={currentStep}
      onChange={handelStepChange}
      spaceEqually={true}
      style={{
        marginBottom: '2rem'
      }}
    >
      {ROLLOUT_STEPS.map((steps) => {
        return <ProgressStep id={steps.id} label={steps.label} secondaryLabel={steps.secondaryLabel} />;
      })}
    </ProgressIndicator>
  );
}
