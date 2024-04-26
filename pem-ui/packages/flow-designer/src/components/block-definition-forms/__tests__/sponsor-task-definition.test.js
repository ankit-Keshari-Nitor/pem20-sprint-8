import { render } from '@testing-library/react';
import { createContainer } from '../../../utils/test-helper';
import SponsorTaskDefinitionForm from '../sponsor-task-definition';

let container;

describe('SponsorDefineForm', () => {
  beforeEach(() => {
    container = createContainer();
  });

  afterEach(function () {
    container.remove();
  });

  it('should form render', () => {
    render(getComponent());
  });

  //   it('should Form render', () => {
  //     // when;
  //     render(getComponent());

  //     // then
  //     //expect(screen.getByTestId('test-form-render')).toBeInTheDocument();

  //     const checkTextInput = screen.getByRole('textbox');

  //     expect(checkTextInput).toBeInTheDocument();

  //     const checkTextInputLabel = screen.getByText('Name');
  //     expect(checkTextInputLabel).toBeInTheDocument();
  //   });

  //   it('should render required label', function () {
  //     // when
  //     render(getComponent({ isRequired: true }));

  //     // then
  //     const checkTextInputLabel = screen.getByText('*');
  //     expect(checkTextInputLabel).toBeInTheDocument();
  //   });

  //   it('should render helper text', function () {
  //     // when
  //     render(getComponent({ helperText: 'helperText' }));

  //     // then
  //     const checkTextInputHelperText = screen.getByText('helperText');
  //     expect(checkTextInputHelperText).toBeInTheDocument();
  //   });
});

const getComponent = () => {
  return <SponsorTaskDefinitionForm />;
};
