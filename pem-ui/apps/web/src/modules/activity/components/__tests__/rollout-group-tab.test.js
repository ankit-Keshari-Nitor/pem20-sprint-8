import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import RolloutGroupTab from '../rollout-wizard/elements/rollout-group-tab';

function createContainer() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  return container;
}
let container;

describe('RolloutGroupTab Component', () => {
  beforeEach(() => {
    container = createContainer();
  });

  afterEach(function () {
    container.remove();
  });

  it('should render Group Label', () => {
    // when;
    render(getComponent());

    // then
    expect(screen.getByTestId('rollout-gap-details')).toBeInTheDocument();

    const checkAccordionLabel = screen.getByText('Group');
    expect(checkAccordionLabel).toBeInTheDocument();
  });

  it('should render Attributes Label', () => {
    // when;
    render(getComponent());

    // then
    expect(screen.getByTestId('rollout-gap-details')).toBeInTheDocument();

    const checkAccordionLabel = screen.getByText('Attributes');
    expect(checkAccordionLabel).toBeInTheDocument();
  });

  it('should render Trading Partners Label', () => {
    // when;
    render(getComponent());

    // then
    expect(screen.getByTestId('rollout-gap-details')).toBeInTheDocument();

    const checkAccordionLabel = screen.getByText('Trading Partners');
    expect(checkAccordionLabel).toBeInTheDocument();
  });
});

const getComponent = () => {
  return <RolloutGroupTab />;
};
