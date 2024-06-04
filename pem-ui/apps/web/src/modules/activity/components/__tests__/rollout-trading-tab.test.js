import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import RolloutTradingTab from '../rollout-wizard/elements/rollout-trading-tab';

function createContainer() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  return container;
}
let container;

describe('RolloutTradingTab Component', () => {
  beforeEach(() => {
    container = createContainer();
  });

  afterEach(function () {
    container.remove();
  });

  it('should render Group Label', () => {
    //when
    render(getComponent());
    //then
    expect(screen.getByText('Partner List')).toBeInTheDocument();
  });

  it('should render Attributes Label', () => {
    //when
    render(getComponent());
    //then
    const checkLabel = screen.getByText('No Data to Display');
    expect(checkLabel).toBeInTheDocument();
  });

  it('should render Trading Partners Label', () => {
    //when
    render(getComponent());
    //then
    const selectLabel = screen.getByLabelText('Select an trading partners');
    expect(selectLabel).toBeInTheDocument();
  });
});

const getComponent = () => {
  return <RolloutTradingTab />;
};
