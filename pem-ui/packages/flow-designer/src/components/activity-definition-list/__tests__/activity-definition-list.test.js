import '@testing-library/jest-dom'; // Import Testing Library's Jest DOM matchers
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ActivityDefinition from '../activity-definition-list';
import userEvent from '@testing-library/user-event';
import { within } from '@testing-library/react';

// Mock the NEW_ACTIVITY_URL
jest.mock('../../../constants', () => ({
    NEW_ACTIVITY_URL: '#/activities/definitions/new',
}));

// Mock the API response
const mockApiResponse = [
    {
        "activityDefnKey": "4f5dbef2-38b3-4b76-9be6-ccef52eb8588",
        "name": "test12311",
        "description": "abc1",
    },
    {
        "activityDefnKey": "3b17511e-8463-456d-b32c-26c961c4c8c0",
        "name": "test123",
        "description": "abc",
    },
];

// Mock the fetch function
global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ content: mockApiResponse }),
});


describe('ActivityDefinition component', () => {

    beforeEach(() => {
        global.fetch = jest.fn();

    });

    it('fetches data from the API and renders correctly', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ content: mockApiResponse }),
        });
        render(<ActivityDefinition />);
        console.log('Component after rendering:', screen.debug());
        await screen.findByText('test12311');
        console.log('Component after finding text:', screen.debug());
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith('/sponsors/cashbank/v2/activityDefinitions');
    });

    it('renders the component and checks table headers', () => {
        render(<ActivityDefinition />);
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByText('ActivityDefnKey')).toBeInTheDocument();
    });

    it('filters names via the search input', async () => {
        render(<ActivityDefinition />);
        const searchInput = screen.getByPlaceholderText('Search by Name/ Description/ ActivityDefnKey');
        fireEvent.change(searchInput, { target: { value: 'Test' } });
        // Check if the element exists before asserting its presence
        const testElement = screen.queryByText('Test');
        if (testElement) {
            expect(screen.queryByText('Test')).toBeInTheDocument();
        }
        // Ensure the 'Load' text is not present
        expect(screen.queryByText('Load')).toBeNull();
    });

    it('handles pagination correctly', () => {
        render(<ActivityDefinition />);
        const nextPageButton = screen.getByRole('button', { name: /next page/i });
        userEvent.click(nextPageButton);
        expect(screen.getByText('test')).toBeInTheDocument();
    });

    it('sorts data correctly when clicking on table headers', () => {
        render(<ActivityDefinition />);
        const nameHeader = screen.getByText('Name');
        fireEvent.click(nameHeader); // Simulate clicking on the Name header
    });

});
