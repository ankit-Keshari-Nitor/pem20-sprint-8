import React from 'react';
import { Modal } from '@carbon/react';

export default function WrapperModal({
  isOpen = false,
  setIsOpen,
  onRequestClose,
  primaryButtonText = '',
  onSecondaryButtonClick,
  onPrimaryButtonClick,
  secondaryButtonText,
  modalHeading,
  children
}) {
  return (
    <>
      <Modal
        open={isOpen}
        onRequestClose={onRequestClose}
        modalHeading={modalHeading}
        onRequestSubmit={onPrimaryButtonClick}
        primaryButtonText={primaryButtonText}
        secondaryButtonText={secondaryButtonText}
        onSecondarySubmit={onSecondaryButtonClick} // Add this handler
      >
        {children}
      </Modal>
    </>
  );
}
