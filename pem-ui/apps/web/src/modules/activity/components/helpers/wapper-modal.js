
import React, { useState } from 'react';
import { Modal } from '@carbon/react';
import CustomInlineNotification from './wapper-notification-toast';

export default function CustomModal({ isOpen = false, setIsOpen, message = "", btnText = "", onPrimaryButtonClick }) {
    const handlePrimaryButtonClick = () => {
        onPrimaryButtonClick(); // Call the passed function
        setIsOpen(false); // Close the modal
    };

    return (
        <>
            <Modal
                open={isOpen}
                onRequestClose={() => setIsOpen(false)}
                modalHeading="Confirmation"
                onRequestSubmit={handlePrimaryButtonClick}
                primaryButtonText={btnText}
                secondaryButtonText="Cancel"
            >
                {message}
            </Modal>
        </>
    );
}