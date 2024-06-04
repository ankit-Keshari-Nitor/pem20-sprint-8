import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RolloutGroupTab from '../rollout-wizard/elements/rollout-group-tab';
import * as RolloutService from '../../services/rollout-service';

jest.mock('../../services/rollout-service');

const mockGroupList = [
  { key: 'group1', value: 'Group 1' },
  { key: 'group2', value: 'Group 2' },
];

describe('RolloutGroupTab', () => {
  beforeEach(() => {
    RolloutService.getGroupList.mockResolvedValue(mockGroupList);
  });

  test('renders the search input', () => {
    render(<RolloutGroupTab />);
    
    const searchInput = screen.getByPlaceholderText('Search by group name');
    expect(searchInput).toBeInTheDocument();
  });

  test('renders the group list', async () => {
    render(<RolloutGroupTab />);
    
    const groupListLabel = screen.getByText('Group List');
    expect(groupListLabel).toBeInTheDocument();

    // Using findAllByText to wait for the asynchronous rendering of checkboxes
    const groupCheckboxes = await screen.findAllByRole('checkbox');
    expect(groupCheckboxes).toHaveLength(mockGroupList.length);

    mockGroupList.forEach((group) => {
      expect(screen.getByLabelText(group.value)).toBeInTheDocument();
    });
  });
});
