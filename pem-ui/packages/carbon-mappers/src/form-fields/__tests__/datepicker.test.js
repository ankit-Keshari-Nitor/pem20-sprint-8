import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DatePicker from '../datepicker'; // Adjust the import according to your file structure

const mockOnChangeHandle = jest.fn();

const defaultProps = {
  field: {
    type: 'datepicker',
    labelText: 'Select Date',
    value: '01/01/2020',
    isRequired: false,
  },
  id: 'datepicker-1',
  currentPath: 'test-path',
  onChangeHandle: mockOnChangeHandle,
  previewMode: false,
};

describe('DatePicker Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders DatePicker component', () => {
    render(<DatePicker {...defaultProps} />);
    expect(screen.getByTestId('datepicker-1')).toBeInTheDocument();
  });

  it('sets initial value in preview mode', () => {
    render(<DatePicker {...defaultProps} previewMode={true} />);
    const input = screen.getByPlaceholderText('mm/dd/yyyy');
    expect(input.value).toBe('01/01/2020');
  });

  it('handles date change', () => {
    render(<DatePicker {...defaultProps} />);
    const input = screen.getByPlaceholderText('mm/dd/yyyy');
    fireEvent.change(input, { target: { value: '02/02/2022' } });
    expect(input.value).toBe('02/02/2022');
  });

  it('does not call onChangeHandle when not in preview mode', () => {
    render(<DatePicker {...defaultProps} />);
    const input = screen.getByPlaceholderText('mm/dd/yyyy');
    fireEvent.change(input, { target: { value: '04/04/2024' } });
    expect(mockOnChangeHandle).not.toHaveBeenCalled();
  });
});
