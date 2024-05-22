
import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import WapperModal from '../helpers/wapper-modal';

describe('WapperModal component', () => {

    it('renders the modal with default props', () => {
        const { getByText } = render(<WapperModal isOpen={true} />);
        expect(getByText('Confirmation')).toBeInTheDocument();
        expect(getByText('Cancel')).toBeInTheDocument();
    });

    it('calls onRequestClose when the modal is closed', () => {
        const onRequestClose = jest.fn();
        const setIsOpen = jest.fn();
        const { getByText } = render(<WapperModal isOpen={true} setIsOpen={setIsOpen} onRequestClose={onRequestClose} />);
        fireEvent.click(getByText('Cancel'));
        expect(setIsOpen).toHaveBeenCalledTimes(1);
    });

    it('calls handlePrimaryButtonClick when the primary button is clicked', () => {
        const handlePrimaryButtonClick = jest.fn();
        const { getByText } = render(
            <WapperModal
                isOpen={true}
                onRequestSubmit={handlePrimaryButtonClick}
                primaryButtonText="Mark as final"
            />
        );
        fireEvent.click(getByText('Mark as final'));
        expect(handlePrimaryButtonClick).toHaveBeenCalledTimes(1);
    });

    it('renders the provided message', () => {
        const message = 'This is a test message';
        const { getByText } = render(<WapperModal isOpen={true} message={message} />);
        expect(getByText(message)).toBeInTheDocument();
    });
});