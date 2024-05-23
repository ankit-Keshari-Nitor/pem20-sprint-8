
import React from 'react';
import { Modal } from '@carbon/react';

export default function WapperModal({ isOpen = false, setIsOpen, primaryButtonText = "", onSecondaryButtonClick, onPrimaryButtonClick, secondaryButtonText, modalHeading, children }) {

    return (
        <>
            <Modal
                open={isOpen}
                onRequestClose={() => setIsOpen(false)}
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