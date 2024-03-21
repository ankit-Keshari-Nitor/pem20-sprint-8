import { render, screen } from '@testing-library/react';
import TextInput from '../text-input';
import { FORM_FIELD_TYPE } from '../../constant';
import { createContainer } from '../../utils/test-helper';

let container;

describe('TextInput', () => {
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
        value: 'Test Input Value'
      })
    );

    // then
    expect(screen.getByTestId('test-text-input')).toBeInTheDocument();

    const checkTextInput = screen.getByRole('textbox');

    expect(checkTextInput).toBeInTheDocument();
    expect(checkTextInput.value).toEqual('Test Input Value');

    const checkTextInputLabel = screen.getByText('Text Input Label');
    expect(checkTextInputLabel).toBeInTheDocument();
  });

  it('should render required label', function () {
    // when
    render(getComponent({ isRequired: true }));

    // then
    const checkTextInputLabel = screen.getByText('*');
    expect(checkTextInputLabel).toBeInTheDocument();
  });

  it('should render helper text', function () {
    // when
    render(getComponent({ helperText: 'helperText' }));

    // then
    const checkTextInputHelperText = screen.getByText('helperText');
    expect(checkTextInputHelperText).toBeInTheDocument();
  });
});

const getComponent = (props) => {
  const defaultField = {
    id: 'test-text-input',
    type: FORM_FIELD_TYPE.TEXT_INPUT,
    labelText: 'Text Input Label',
    ...props
  };
  return <TextInput field={defaultField} />;
};
