import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RolloutDetails from '../rollout-wizard/components/rollout-details';

// Mock props
const mockProps = {
    rolloutDetails: {
        name: '',
        description: '',
        dueDate: '',
        alertDate: '',
        alertInterval: '',
        rollingOutTo: '',
        contextData: ''
    },
    setRolloutDetails: jest.fn(),
    handleAddClick: jest.fn(),
    formErrors: {
        name: false,
        description: false,
        alertInterval: false,
        partnersDetails: false
    },
    rolloutPartnersData: {
        selectedGroupsData: [],
        selectedAttributesData: [],
        selectedPartnersData: []
    },
    handleRemovePartners: jest.fn()
};

describe('RolloutDetails Component', () => {
    it('renders the component', () => {
        render(<RolloutDetails {...mockProps} />);
        expect(screen.getByLabelText('Name (mandatory)')).toBeInTheDocument();
        expect(screen.getByLabelText('Description')).toBeInTheDocument();
        expect(screen.getByLabelText(/Due Date/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Alert Date/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Alert Interval/)).toBeInTheDocument();
        expect(screen.getByText('Rolling out to')).toBeInTheDocument();
    });

    it('handles input changes', () => {
        render(<RolloutDetails {...mockProps} />);

        // Name input change
        const nameInput = screen.getByLabelText('Name (mandatory)');
        fireEvent.change(nameInput, { target: { value: 'Test Name' } });
        expect(mockProps.setRolloutDetails).toHaveBeenCalledWith(expect.any(Function));

        // Description input change
        const descriptionInput = screen.getByLabelText('Description');
        fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
        expect(mockProps.setRolloutDetails).toHaveBeenCalledWith(expect.any(Function));

        // Alert Interval input change
        const alertIntervalInput = screen.getByLabelText(/Alert Interval/);
        fireEvent.change(alertIntervalInput, { target: { value: '5' } });
        expect(mockProps.setRolloutDetails).toHaveBeenCalledWith(expect.any(Function));
    });

    it('handles date picker changes', () => {
        render(<RolloutDetails {...mockProps} />);

        // Due Date picker change
        const dueDateInput = screen.getByPlaceholderText('mm/dd/yyyy');
        fireEvent.change(dueDateInput, { target: { value: '07/20/2024' } });
        expect(mockProps.setRolloutDetails).toHaveBeenCalledWith(expect.any(Function));

        // Alert Date picker change
        const alertDateInput = screen.getByPlaceholderText('mm/dd/yyyy');
        fireEvent.change(alertDateInput, { target: { value: '07/21/2024' } });
        expect(mockProps.setRolloutDetails).toHaveBeenCalledWith(expect.any(Function));
    });

    it('handles rolling out to selection', () => {
        render(<RolloutDetails {...mockProps} />);

        const radioPartners = screen.getByLabelText('Partners');
        fireEvent.click(radioPartners);
        expect(mockProps.setRolloutDetails).toHaveBeenCalledWith(expect.any(Function));

        const radioInternalUsers = screen.getByLabelText('Internal Users');
        fireEvent.click(radioInternalUsers);
        expect(mockProps.setRolloutDetails).toHaveBeenCalledWith(expect.any(Function));
    });

    it('handles add/edit button click', () => {
        render(<RolloutDetails {...mockProps} />);

        const addButton = screen.getByText('Add');
        fireEvent.click(addButton);
        expect(mockProps.handleAddClick).toHaveBeenCalled();
    });

    it('handles context data button click', () => {
        render(<RolloutDetails {...mockProps} />);

        const contextButton = screen.getByText('View Context Data');
        fireEvent.click(contextButton);
        expect(screen.getByText('Hide Context Data')).toBeInTheDocument();
    });

    it('displays tags for selected partners, attributes, and groups', () => {
        const modifiedProps = {
            ...mockProps,
            rolloutDetails: { ...mockProps.rolloutDetails, rollingOutTo: 'partners' },
            rolloutPartnersData: {
                selectedPartnersData: [{ partnerUniqueId: '1', nameOfCompany: 'Partner 1' }],
                selectedAttributesData: [{ attributeUniqueId: '1', attrValue: 'Attribute 1' }],
                selectedGroupsData: [{ groupUniqueId: '1', value: 'Group 1' }]
            }
        };

        render(<RolloutDetails {...modifiedProps} />);

        expect(screen.getByText('Partner 1')).toBeInTheDocument();
        expect(screen.getByText('Attribute 1')).toBeInTheDocument();
        expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    it('handles partner tag removal', () => {
        const modifiedProps = {
            ...mockProps,
            rolloutDetails: { ...mockProps.rolloutDetails, rollingOutTo: 'partners' },
            rolloutPartnersData: {
                selectedPartnersData: [{ partnerUniqueId: '1', nameOfCompany: 'Partner 1' }],
                selectedAttributesData: [],
                selectedGroupsData: []
            }
        };

        render(<RolloutDetails {...modifiedProps} />);

        const removeButton = screen.getByRole('button', { name: /Close/ });
        fireEvent.click(removeButton);
        expect(mockProps.handleRemovePartners).toHaveBeenCalledWith(['1']);
    });
});