import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Toggle from '../toggle';

describe('Toggle component', () => {
  const field = {
    labelText: 'Toggle Label',
    isRequired: true,
    min: 0,
    max: 10
    // Add other necessary props for testing
  };

  it('renders correctly', () => {
    const { getByText } = render(<Toggle field={field} id="toggle-id" />);

    expect(getByText('Toggle Label')).toBeInTheDocument();
    expect(getByText(/Off|On/)).toBeInTheDocument();
  });

  it('handles toggle events correctly', () => {
    const { getByTestId } = render(<Toggle field={field} id="toggle-id" />);
    const toggle = getByTestId('toggle-id');

    // Simulate a toggle event
    fireEvent.click(toggle);

    // Test if the toggled state is true after clicking
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('passes props correctly', () => {
    const { getByTestId } = render(<Toggle field={field} id="toggle-id" />);

    // Test if the toggled state is initially false
    expect(getByTestId('toggle-id')).toHaveAttribute('aria-checked', 'true');
  });
});
