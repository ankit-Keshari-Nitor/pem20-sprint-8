import React from 'react';
import { render, fireEvent, getByRole } from '@testing-library/react';
import FileUploader from '../file-upload';

describe('FileUploader', () => {
  it('renders with correct labels and attributes', () => {
    const { getByText, getByTestId } = render(<FileUploader field={{}} id="fileUploaderTestId" />);

    expect(getByText('Upload files')).toBeInTheDocument();
    expect(getByText('Max file size is 500mb. Only .jpg files are supported.')).toBeInTheDocument();
    expect(getByTestId('fileUploaderTestId')).toBeInTheDocument();
  });

  it('allows adding files', () => {
    const { getByLabelText } = render(<FileUploader field={{}} id="fileUploaderTestId" />);

    const fileInput = getByLabelText('Add file');
    fireEvent.change(fileInput, { target: { files: [{ name: 'test.jpg', type: 'image/jpeg' }] } });

    expect(fileInput.files[0]).toBeDefined();
    expect(fileInput.files[0].name).toBe('test.jpg');
    expect(fileInput.files[0].type).toBe('image/jpeg');
  });
});
