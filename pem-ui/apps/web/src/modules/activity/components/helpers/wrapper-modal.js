
import React from 'react';
import { Modal } from '@carbon/react';

export default function WrapperModal({ isOpen = false, setIsOpen, primaryButtonText = "", onSecondaryButtonClick, onPrimaryButtonClick, secondaryButtonText, modalHeading, children }) {

    return (
        <>
            <Modal
                open={isOpen}
                onRequestClose={onSecondaryButtonClick}
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