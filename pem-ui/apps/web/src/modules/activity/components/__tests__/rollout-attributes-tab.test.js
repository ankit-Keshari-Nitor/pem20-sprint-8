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
    render(getComponent(), { container });

    // then
    const attributeListLabel = screen.getByText('Attribute List');
    expect(attributeListLabel).toBeInTheDocument();
    expect(attributeListLabel).toHaveClass('rollout-list-text');
  });

  it('should render Select attribute type dropdown', () => {
    // when;
    render(getComponent(), { container });

    // then
    const selectInput = screen.getByLabelText('Select an attribute type');
    expect(selectInput).toBeInTheDocument();
    expect(selectInput).toHaveClass('cds--select-input');
  });

  it('should render Search input', () => {
    // when;
    render(getComponent(), { container });

    // then
    const searchInput = screen.getByPlaceholderText('Search by attribute type');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveClass('cds--text-input');
  });
});

const getComponent = () => {
  return <RolloutAttributeTab />;
};
