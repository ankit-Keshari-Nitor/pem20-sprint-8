import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import ActivityList from '../activity-list';
import userEvent from '@testing-library/user-event';
import * as ActivityService from '../../activity-service'; // Import the service

jest.mock('../../activity-service');

describe('ActivityList', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', async () => {
        const data = {
            content: [],
            pageContent: { totalElements: 0 },
        };
        ActivityService.getActivityList.mockResolvedValue(Promise.resolve(data));
        const { container } = render(<ActivityList />);
        expect(container).toMatchSnapshot();
    });

    it('calls getActivityList on mount', () => {
        ActivityService.getActivityList.mockResolvedValue({
            content: [],
            pageContent: { totalElements: 0 },
        });
        render(<ActivityList />);
        expect(ActivityService.getActivityList).toHaveBeenCalledTimes(1);
    });

    it('updates searchKey state when search input changes', async () => {
        const data = {
            content: [],
            pageContent: { totalElements: 0 },
        };
        ActivityService.getActivityList.mockResolvedValue(Promise.resolve(data));

        const { getByPlaceholderText } = render(<ActivityList />);
        const searchInput = getByPlaceholderText('');

        fireEvent.change(searchInput, { target: { value: 'test' } });

        await waitFor(() => expect(ActivityService.getActivityList).toHaveBeenCalledWith(
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
        ActivityService.getActivityList.mockResolvedValue(data);

        const { getByRole, getByText } = render(<ActivityList />);

        const filterDropdown = getByRole('combobox', { name: 'Select Filter' });
        fireEvent.mouseDown(filterDropdown);
        const activityNameOption = getByText('Activity Name');
        fireEvent.click(activityNameOption);

        await waitFor(() => expect(ActivityService.getActivityList).toHaveBeenCalledTimes(2));
    });

    it('calls handlePaginationChange when pagination changes', async () => {
        const data = {
            content: [],
            pageContent: { totalElements: 0 },
        };
        ActivityService.getActivityList.mockResolvedValue(data);
        const { getByText } = render(<ActivityList />);
        const paginationNextButton = getByText('Next page');
        fireEvent.click(paginationNextButton);
        await waitFor(() => expect(ActivityService.getActivityList).toHaveBeenCalledTimes(1));
    });

    it('renders table with correct headers', async () => {
        const data = {
            content: [],
            pageContent: { totalElements: 0 },
        };
        ActivityService.getActivityList.mockResolvedValue(data);
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
                status: 'draft',
                version: '1.0',
            },
            {
                id: 2,
                name: 'Activity 2',
                encrypted: false,
                status: 'final',
                version: '2.0',
            },
        ];
        ActivityService.getActivityList.mockResolvedValue({
            content: data,
            pageContent: { totalElements: 2 },
        });
        const { getByText } = render(<ActivityList />);
        await waitFor(() => getByText('Activity 1'));
        expect(getByText('Activity 1')).toBeInTheDocument();
        expect(getByText('Activity 2')).toBeInTheDocument();
    });

    it('calls handleDeleteActivity and updates data', async () => {
        const mockData = {
            content: [{ id: '1', name: 'Test Activity' }],
            pageContent: { totalElements: 1 },
        };

        const mockDeleteResponse = { response: 'Success' };

        ActivityService.getActivityList.mockResolvedValue(mockData);
        ActivityService.deleteActivityList.mockResolvedValue(mockDeleteResponse);

        const { getByText, findByRole } = render(<ActivityList />);

        await waitFor(() => {
            expect(ActivityService.getActivityList).toHaveBeenCalledTimes(1);
            expect(screen.getByText('Test Activity')).toBeInTheDocument();
        });

        const ellipsisButton = await findByRole('button', { name: /options/i });
        userEvent.click(ellipsisButton);

        const deleteButton = getByText(/Delete/i);
        userEvent.click(deleteButton);

        const deleteBtn = await findByRole('button', { name: /Delete/i });
        userEvent.click(deleteBtn);

        await waitFor(() => {
            expect(ActivityService.deleteActivityList).toHaveBeenCalledTimes(1);
            expect(ActivityService.getActivityList).toHaveBeenCalledTimes(2);
        });

        await waitFor(() => {
            const element = screen.getByText('Test Activity');
            expect(element).not.toBeNull();
        });
    });

});

