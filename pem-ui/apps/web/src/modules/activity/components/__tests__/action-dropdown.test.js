import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ActivityDropdown from '../actions-dropdown';
import { setTimeout } from 'timers/promises';

describe('ActivityDropdown component', () => {
    const onChange = jest.fn();

    const defaultProps = {
        id: 'test',
        items: [
            { label: 'Item 1', value: 'value1' },
            { label: 'Item 2', value: 'value2' },
            { label: 'Item 3', value: 'value3' },
        ],
        onChange,
    };

    it('renders with default props', () => {
        const { getByText } = render(<ActivityDropdown {...defaultProps} />);
        expect(getByText('Choose an action')).toBeInTheDocument();
    });

    it('calls onChange when an item is selected', async () => {
        const { getByRole, getByText } = render(<ActivityDropdown {...defaultProps} />);
        await waitFor(() => getByRole('combobox'));
        fireEvent.click(getByRole('combobox'));
        fireEvent.click(getByText('Item 2'));
        expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ selectedItem: { label: 'Item 2', value: 'value2' } }));
    });

    it('does not call onChange when no item is selected', async () => {
        const { getByText, queryByText } = render(<ActivityDropdown {...defaultProps} />);
        fireEvent.click(getByText('Choose an action'));
        await waitFor(() => getByText('Item 1'), { timeout: 500 }); // Wait for items to render
        await setTimeout(100);
        fireEvent.blur(getByText('Choose an action'));
        await setTimeout(100);
        await waitFor(() => expect(queryByText('Item 1')).toBeNull(), { timeout: 500 });
        expect(onChange).not.toHaveBeenCalled();
    });

    it('handles empty items prop', () => {
        const { queryByLabelText } = render(<ActivityDropdown {...defaultProps} items={[]} />);
        expect(queryByLabelText('Choose an action')).toBeNull();
    });

    it('handles non-array items prop', () => {
        const { queryByLabelText } = render(<ActivityDropdown {...defaultProps} items={null} />);
        expect(queryByLabelText('Choose an action')).toBeNull();
    });
});
