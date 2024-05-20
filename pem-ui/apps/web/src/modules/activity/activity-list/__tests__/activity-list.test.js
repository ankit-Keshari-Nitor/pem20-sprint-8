import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import ActivityList from '../activity-list';
import { getActivityList } from '../../activity-service';

jest.mock('../../activity-service');

describe('ActivityList', () => {
    it('renders correctly', async () => {
        const data = {
            content: [],
            pageContent: { totalElements: 0 },
        };
        getActivityList.mockResolvedValue(Promise.resolve(data));
        const { container } = render(<ActivityList />);
        expect(container).toMatchSnapshot();
    });

    it('calls getActivityList on mount', () => {
        getActivityList.mockResolvedValue({
            content: [],
            pageContent: { totalElements: 0 },
        });
        render(<ActivityList />);
        expect(getActivityList).toHaveBeenCalledTimes(1);
    });

    it('updates searchKey state when search input changes', async () => {
        const data = {
            content: [],
            pageContent: { totalElements: 0 },
        };
        getActivityList.mockResolvedValue(Promise.resolve(data));

        const { getByPlaceholderText } = render(<ActivityList />);
        const searchInput = getByPlaceholderText('');

        fireEvent.change(searchInput, { target: { value: 'test' } });

        await waitFor(() => expect(getActivityList).toHaveBeenCalledWith(
            0,
            10,
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
        getActivityList.mockResolvedValue(data);

        const { getByRole, getByText } = render(<ActivityList />);

        const filterDropdown = getByRole('combobox', { name: 'Select Filter' });
        fireEvent.mouseDown(filterDropdown);
        const activityNameOption = getByText('Activity Name');
        fireEvent.click(activityNameOption);

        await waitFor(() => expect(getActivityList).toHaveBeenCalledTimes(2));
    });

    it('calls handlePaginationChange when pagination changes', async () => {
        const data = {
            content: [],
            pageContent: { totalElements: 0 },
        };
        getActivityList.mockResolvedValue(data);
        const { getByText } = render(<ActivityList />);
        const paginationNextButton = getByText('Next page');
        fireEvent.click(paginationNextButton);
        await waitFor(() => expect(getActivityList).toHaveBeenCalledTimes(1));
    });

    it('renders table with correct headers', async () => {
        const data = {
            content: [],
            pageContent: { totalElements: 0 },
        };
        getActivityList.mockResolvedValue(data);
        const { getByText } = render(<ActivityList />);
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
        getActivityList.mockResolvedValue({
            content: data,
            pageContent: { totalElements: 2 },
        });
        const { getByText } = render(<ActivityList />);
        await waitFor(() => getByText('Activity 1'));
        expect(getByText('Activity 1')).toBeInTheDocument();
        expect(getByText('Activity 2')).toBeInTheDocument();
    });
});

