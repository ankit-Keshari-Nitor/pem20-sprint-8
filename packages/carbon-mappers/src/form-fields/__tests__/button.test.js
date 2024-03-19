import { render, screen } from '@testing-library/react';
import { FORM_FIELD_TYPE } from '../../constant';
import Button from '../button';
import { createContainer } from '../../utils/test-helper';

let container;

describe('Button', () => {
  beforeEach(() => {
    container = createContainer();
  });

  afterEach(function () {
    container.remove();
  });

  it('should render', () => {
    // when;
    render(
      getComponent({
        value: 'Test Button value'
      })
    );

    // then
    expect(screen.getByTestId('test-button')).toBeInTheDocument();

    const checkButton = screen.getByRole('button');

    expect(checkButton).toBeInTheDocument();
    expect(checkButton.value).toEqual('Test Button value');

    const checkButtonLabel = screen.getByText('Button Label');
    expect(checkButtonLabel).toBeInTheDocument();
  });
});

const getComponent = (props) => {
  const defaultField = {
    id: 'test-button',
    type: FORM_FIELD_TYPE.BUTTON,
    labelText: 'Button Label',
    ...props
  };
  return <Button field={defaultField} />;
};
