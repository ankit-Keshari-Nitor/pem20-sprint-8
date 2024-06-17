import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Tooltip from '../tooltip';
import { FORM_FIELD_TYPE, FORM_FIELD_LABEL, FORM_FIELD_GROUPS } from '../../constant';

const field = {
  labelText: 'Info tooltip',
};

describe('Tooltip Component ', () => {
  test('Renders without crashing', () => {
    render(<Tooltip field={field} id="test-tooltip" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('Renders with correct label text', () => {
    render(<Tooltip field={field} id="test-tooltip" />);
    const tooltipTrigger = screen.getByRole('button');
    fireEvent.mouseOver(tooltipTrigger);
    expect(screen.getByText('Info tooltip')).toBeInTheDocument();
  });

  test('Button click triggers the tooltip', () => {
    render(<Tooltip field={field} id="test-tooltip" />);
    const tooltipTrigger = screen.getByRole('button');
    fireEvent.click(tooltipTrigger);
    // Depending on the implementation of CarbonTooltip, you may need to use different queries or methods
    expect(screen.getByText('Info tooltip')).toBeVisible();
  });

  test('Matches snapshot', () => {
    const { asFragment } = render(<Tooltip field={field} id="test-tooltip" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
