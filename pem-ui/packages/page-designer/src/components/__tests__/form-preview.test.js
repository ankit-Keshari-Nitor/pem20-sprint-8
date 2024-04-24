import { render, screen } from '@testing-library/react';
import { createContainer } from '../../utils/helpers';
import FormPreview from '../preview-mode';
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
 