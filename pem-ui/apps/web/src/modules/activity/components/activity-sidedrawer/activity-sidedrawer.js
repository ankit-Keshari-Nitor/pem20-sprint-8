import React from 'react';
import classes from './activity-sidedrawer.module.scss';
import { changeAnchor } from './change-anchor';

const ActivityVersionsSideDrawer = ({
  open,
  anchor,
  onClose,
  children

}) => {
  const { drawer, animate, hidden, overlay, overlayOpen, overlayHidden, header, actionItem } = classes;


  return (
    <>
      <div className={`${overlay} ${!open && overlayHidden} ${open && overlayOpen}`} onClick={onClose} aria-hidden="true" data-testid="overlay" />
      <div tabIndex="-1" className={`${drawer} ${actionItem} ${open && animate} ${!open && hidden}  ${changeAnchor(anchor, classes)}`} data-testid="drawer">
        {children}
      </div>
    </>
  );
};

export default ActivityVersionsSideDrawer;