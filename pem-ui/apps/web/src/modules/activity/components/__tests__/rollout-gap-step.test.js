import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Add this line to import jest-dom matchers
import RolloutGapDetails from '../rollout-wizard/elements/rollout-gap-step';
import { Tab } from '@carbon/react';

jest.mock('../rollout-wizard/elements/rollout-group-tab', () => () => <div>Group Tab Content</div>);
jest.mock('../rollout-wizard/elements/rollout-trading-tab', () => () => <div>Trading Partners Tab Content</div>);
jest.mock('../rollout-wizard/elements/rollout-attributes-tab', () => () => <div>Attributes Tab Content</div>);

describe('RolloutGapDetails', () => {
  beforeEach(() => {
    window.matchMedia =
      window.matchMedia ||
      function () {
        return {
          matches: false,
          addListener: function () {},
          removeListener: function () {}
        };
      };
  });

  afterEach(() => {
    window.matchMedia = undefined;
  });

  it('renders Group tab by default', () => {
    render(<RolloutGapDetails id="test-id" />);
    expect(screen.getByText('Group Tab Content')).toBeInTheDocument();
  });

  it('renders Attributes tab content when Attributes tab is clicked', () => {
    render(<RolloutGapDetails id="test-id" />);
    const attributesTab = screen.getByRole('tab', { name: /Attributes/i });
    attributesTab.click();
    expect(screen.getByText('Attributes Tab Content')).toBeInTheDocument();
  });

  it('renders Trading Partners tab content when Trading Partners tab is clicked', () => {
    render(<RolloutGapDetails id="test-id" />);
    const tradingPartnersTab = screen.getByRole('tab', { name: /Trading Partners/i });
    tradingPartnersTab.click();
    expect(screen.getByText('Trading Partners Tab Content')).toBeInTheDocument();
  });
});
