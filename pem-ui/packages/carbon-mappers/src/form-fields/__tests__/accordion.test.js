import { render, screen } from '@testing-library/react';
import Accordion from '../accordion';
import { FORM_FIELD_TYPE } from '../../constant';
import { createContainer } from '../../utils/test-helper';

let container;

describe('Accordion', () => {
  beforeEach(() => {
    container = createContainer();
  });

  afterEach(function () {
    container.remove();
  });

  it('should render', () => {
    // when;
    render(getComponent());

    // then
    expect(screen.getByTestId('test-accordion')).toBeInTheDocument();

    const checkAccordion = screen.getByRole('button');

    expect(checkAccordion).toBeInTheDocument();

    const checkAccordionLabel = screen.getByText('Accordion Label');
    expect(checkAccordionLabel).toBeInTheDocument();
  });
});

const getComponent = (props) => {
  const defaultField = {
    id: 'test-accordion',
    type: FORM_FIELD_TYPE.ACCORDION,
    labelText: 'Accordion Label',
    ...props
  };
  return <Accordion field={defaultField} />;
};
