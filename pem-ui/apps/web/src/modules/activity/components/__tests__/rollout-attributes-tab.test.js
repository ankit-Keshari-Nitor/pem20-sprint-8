import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import RolloutAttributeTab from '../rollout-wizard/elements/rollout-attributes-tab';

function createContainer() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  return container;
}
let container;

describe('RolloutAttributeTab Component', () => {
  beforeEach(() => {
    container = createContainer();
  });

  afterEach(function () {
    container.remove();
  });

  it('should render Attribute List Label', () => {
    // when;
    render(getComponent());

    // then
    expect(screen.getByTestId('rollout-gap-details')).toBeInTheDocument();

    const checkAccordionLabel = screen.getByText('Attribute List');
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
  return <RolloutAttributeTab />;
};
