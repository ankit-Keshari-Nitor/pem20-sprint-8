import React from 'react';
import { InlineNotification } from '@carbon/react';

export default function WapperNotification({ open, title, subtitle, kind, onCloseButtonClick }) {
    return (
        <div className="custom-inline-notification-container">
            <InlineNotification
                open={open}
                title={title}
                subtitle={subtitle}
                kind={kind}
                onCloseButtonClick={onCloseButtonClick}
            />
        </div>
    );
}
