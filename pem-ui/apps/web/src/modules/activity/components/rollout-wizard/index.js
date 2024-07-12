import React, { useState } from 'react';
import GenericModal from '../../helpers/wrapper-modal';

import RolloutPartnersDetails from './components/rollout-partners-details';
import RolloutDetails from './components/rollout-details';


const ActivityRolloutModal = (props) => {
  const { showModal, setShowModal, activityName } = props;
  const [openAddModal, setOpenAddModal] = useState(false);
  const [rolloutPartnersData, setRolloutPartnersData] = useState({ selectedGroupsData: [], selectedAttributesData: [], selectedPartnersData: [] });
  const [rolloutDetails, setRolloutDetails] = useState({
    name: '',
    dueDate: new Date(),
    description: '',
    alertDate: new Date(),
    alertInterval: 0,
    rollingOutTo: 'internal_users'
  });

  const handleActivityRollout = () => {
    //todo - get all data and call rollout/create instance api from here -- close dialog once done
  };

  // Function to handle the Next/rollout Button Click
  const handleBackToDetails = () => {
    setOpenAddModal(false);
  };

  const handleAddGroups = (selectedGroupsData) => {
    setRolloutPartnersData((prev) => ({ ...prev, selectedGroupsData: [...selectedGroupsData] }));
  };

  const handleAddAttributes = (selectedAttributesData) => {
    setRolloutPartnersData((prev) => ({ ...prev, selectedAttributesData: [...selectedAttributesData] }));
  };

  const handleAddPartners = (selectedPartnersData) => {
    setRolloutPartnersData((prev) => ({ ...prev, selectedPartnersData: [...selectedPartnersData] }));
  };
  return (
    <>
      <GenericModal
        isOpen={showModal}
        modalLabel={`Activity Rollout -${activityName}`}
        modalHeading={openAddModal ? 'Adding Partners' : 'Details'}
        secondaryButtonText={openAddModal ? 'Back to Details' : 'Cancel'}
        primaryButtonText={openAddModal ? 'Save' : 'Rollout'}
        onPrimaryButtonClick={handleActivityRollout}
        onSecondaryButtonClick={() => (openAddModal ? handleBackToDetails() : setShowModal(false))}
        onRequestClose={() => setShowModal(false)}
      >
        {openAddModal ? (
          <RolloutPartnersDetails handleAddGroups={handleAddGroups} handleAddAttributes={handleAddAttributes} handleAddPartners={handleAddPartners} rolloutPartnersData={rolloutPartnersData} />
        ) : (
          <RolloutDetails {...props} rolloutDetails={rolloutDetails} setRolloutDetails={setRolloutDetails} handleAddClick={() => setOpenAddModal(true)} />
        )}
      </GenericModal>
    </>
  );
};

export default ActivityRolloutModal;
