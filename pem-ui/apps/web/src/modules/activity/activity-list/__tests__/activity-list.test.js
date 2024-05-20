import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import ActivityDefinition from '../activity-definition-list';
import { fetchData } from '../service/activity-definition';

jest.mock('../service/activity-definition');

describe('ActivityDefinition', () => {
    it('renders correctly', async () => {
        const data = {
            content: [],
            pageContent: { totalElements: 0 },
        };
        fetchData.mockResolvedValue(Promise.resolve(data));
        const { container } = render(<ActivityDefinition />);
        expect(container).toMatchSnapshot();
    });

    it('calls fetchData on mount', () => {
        fetchData.mockResolvedValue({
            content: [],
            pageContent: { totalElements: 0 },
        });
        render(<ActivityDefinition />);
        expect(fetchData).toHaveBeenCalledTimes(1);
    });

    it('updates searchKey state when search input changes', async () => {
        const data = {
            content: [],
            pageContent: { totalElements: 0 },
        };
        fetchData.mockResolvedValue(Promise.resolve(data));

        const { getByPlaceholderText } = render(<ActivityDefinition />);
        const searchInput = getByPlaceholderText('');

        fireEvent.change(searchInput, { target: { value: 'test' } });

        await waitFor(() => expect(fetchData).toHaveBeenCalledWith(
            0,
            2,
            'ASC',
            '',
            'test'
        ));
    });

    it('calls handleFilterChange when filter dropdown changes', async () => {
        const data = {
            content: [],
            pageContent: { totalElements: 0 },
        };
        fetchData.mockResolvedValue(data);

        const { getByRole, getByText } = render(<ActivityDefinition />);

        const filterDropdown = getByRole('combobox', { name: 'Select Filter' });
        fireEvent.mouseDown(filterDropdown);
        const activityNameOption = getByText('Activity Name');
        fireEvent.click(activityNameOption);

        await waitFor(() => expect(fetchData).toHaveBeenCalledTimes(2));
    });

    it('calls handlePaginationChange when pagination changes', async () => {
        const data = {
            content: [],
            pageContent: { totalElements: 0 },
        };
        fetchData.mockResolvedValue(data);
        const { getByText } = render(<ActivityDefinition />);
        const paginationNextButton = getByText('Next page');
        fireEvent.click(paginationNextButton);
        await waitFor(() => expect(fetchData).toHaveBeenCalledTimes(1));
    });

    it('renders table with correct headers', async () => {
        const data = {
            content: [],
            pageContent: { totalElements: 0 },
        };
        fetchData.mockResolvedValue(data);
        const { getByText } = render(<ActivityDefinition />);
        await waitFor(() => {
            expect(getByText('Activity Name')).toBeInTheDocument();
            expect(getByText('Encrypted')).toBeInTheDocument();
            expect(getByText('Current Status')).toBeInTheDocument();
            expect(getByText('Default Version')).toBeInTheDocument();
            expect(getByText('Actions')).toBeInTheDocument();
        });
    });

    it('renders table with correct data', async () => {
        const data = [
            {
                id: 1,
                name: 'Activity 1',
                encrypted: true,
                status: 'active',
                version: '1.0',
            },
            {
                id: 2,
                name: 'Activity 2',
                encrypted: false,
                status: 'inactive',
                version: '2.0',
            },
        ];
        fetchData.mockResolvedValue({
            content: data,
            pageContent: { totalElements: 2 },
        });
        const { getByText } = render(<ActivityDefinition />);
        await waitFor(() => getByText('Activity 1'));
        expect(getByText('Activity 1')).toBeInTheDocument();
        expect(getByText('Activity 2')).toBeInTheDocument();
    });
});

