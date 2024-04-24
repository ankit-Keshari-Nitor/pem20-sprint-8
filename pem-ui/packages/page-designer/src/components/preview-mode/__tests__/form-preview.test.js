import { render, screen } from '@testing-library/react';
import { createContainer } from '../../../utils/test-helper';
import FormPreview from '../form-preview';
let container;

describe('PreviewForm', () => {
  beforeEach(() => {
    container = createContainer();
  });

  afterEach(function () {
    container.remove();
  });

  it('should preview modal render', () => {
    // when;
    render(
      getComponent({
        layout: []
      })
    );

    // then
    expect(screen.getByTestId('test-form-preview-id')).toBeInTheDocument();
  });
});

const getComponent = (props) => {
  return <FormPreview layout={props.layout} dataTestid={'test-form-preview-id'} />;
};
