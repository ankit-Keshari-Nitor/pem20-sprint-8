import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ActivityVersionsSideDrawer from '../activity-sidedrawer/activity-sidedrawer';
import * as ActivityService from '../../services/activity-service';

// Mock the ActivityService
jest.mock('../../services/activity-service');

describe('ActivityVersionsSideDrawer', () => {
    const defaultProps = {
        open: false,
        anchor: 'left',
        onClose: jest.fn(),
        children: <div>Test Children</div>,
        drawerVersionId: 1,
        setVersionData: jest.fn(),
        setTotalVersionRows: jest.fn(),
        handleVersionPagination: jest.fn(),
        versionPageNo: 1,
        versionPageSize: 10,
        sortDir: 'asc',
        status: 'active',
        classes: {
            drawer: 'drawer',
            animate: 'animate',
            hidden: 'hidden',
            overlay: 'overlay',
            overlayOpen: 'overlayOpen',
            overlayHidden: 'overlayHidden',
            header: 'header',
            actionItem: 'actionItem'
        }
    };

    beforeEach(() => {
        ActivityService.getActivityVersionkey.mockResolvedValue({
            content: [],
            pageContent: { totalElements: 0 }
        });
    });

    it('renders the children correctly', async () => {
        render(<ActivityVersionsSideDrawer {...defaultProps} open={true} />);
        expect(screen.getByText('Test Children')).toBeInTheDocument();
    });

    it('calls onClose when overlay is clicked', () => {
        render(<ActivityVersionsSideDrawer {...defaultProps} open={true} />);
        fireEvent.click(screen.getByTestId('overlay'));
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('applies the correct class names based on open prop', () => {
        const { rerender } = render(<ActivityVersionsSideDrawer {...defaultProps} open={false} />);
        expect(screen.getByTestId('overlay')).toHaveClass(defaultProps.classes.overlayHidden);
        rerender(<ActivityVersionsSideDrawer {...defaultProps} open={true} />);
        expect(screen.getByTestId('overlay')).toHaveClass(defaultProps.classes.overlayOpen);
    });

    it('fetches data when drawerVersionId changes', async () => {
        const newProps = { ...defaultProps, open: true, drawerVersionId: 2 };
        const mockData = {
            content: [],
            pageContent: { totalElements: 0 }
        };

        ActivityService.getActivityVersionkey.mockResolvedValueOnce(mockData);
        const { rerender } = render(<ActivityVersionsSideDrawer {...newProps} />);

        await waitFor(() => expect(ActivityService.getActivityVersionkey).toHaveBeenCalledWith(
            newProps.versionPageNo - 1,
            newProps.versionPageSize,
            newProps.sortDir,
            newProps.status,
            true,
            newProps.drawerVersionId
        ));

        await rerender(<ActivityVersionsSideDrawer {...newProps} drawerVersionId={2} />);
        await waitFor(() => expect(ActivityService.getActivityVersionkey).toHaveBeenCalledWith(
            newProps.versionPageNo - 1,
            newProps.versionPageSize,
            newProps.sortDir,
            newProps.status,
            true,
            2
        ));
    });
});