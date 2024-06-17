import React from 'react';
import { render, screen } from '@testing-library/react';
import Select from '../select'; // Adjust the import path as necessary
import { FORM_FIELD_TYPE } from '../../constant';

const mockField = {
  type: FORM_FIELD_TYPE.SELECT,
  labelText: 'Test Label',
  isRequired: true,
  options: [
    { id: '1', value: 'option1', label: 'Option 1' },
    { id: '2', value: 'option2', label: 'Option 2' }
  ],
  isDisabled: false,
  readOnly: false
};

describe('Select Component', () => {
  it('renders the select component with the correct label and options', () => {
    render(<Select field={mockField} id="test-select" />);

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();

    mockField.options.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });
});
