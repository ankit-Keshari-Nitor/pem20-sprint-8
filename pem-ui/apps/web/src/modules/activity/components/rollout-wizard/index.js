import React, { useState } from 'react';
import RolloutDetails from './rollout-details';
import RolloutGapDetails from './rollout-gap-details';
import GenericModal from '../../helpers/wrapper-modal';

const ActivityRolloutModal = (props) => {
  const { showModal, setShowModal, activityName } = props;
  const [rolloutGapData, setRolloutGapData] = useState({ selectedGroupsData: [], selectedAttributesData: [], selectedPartnersData: [] });
  const [rolloutDetails, setRolloutDetails] = useState({
    dueDate: new Date(),
    description: '',
    alertDate: new Date(),
    alertInterval: 0,
    rollingOutTo: 'partners'
  });
  const [openAddModal, setOpenAddModal] = useState(false);

  const handleActivityRollout = () => {
    //todo - get all data and call rollout/create instance api from here -- close dialog once done
  };

  // Function to handle the Next/rollout Button Click
  const handleBackToDetails = () => {
    setOpenAddModal(false);
  };

  const handleAddGroups = (selectedGroupsData) => {
    setRolloutGapData((prev) => ({ ...prev, selectedGroupsData: [...selectedGroupsData] }));
  };

  const handleAddAttributes = (selectedAttributesData) => {
    setRolloutGapData((prev) => ({ ...prev, selectedAttributesData: [...selectedAttributesData] }));
  };

  const handleAddPartners = (selectedPartnersData) => {
    setRolloutGapData((prev) => ({ ...prev, selectedPartnersData: [...selectedPartnersData] }));
  };

  return (
    <>
      <GenericModal
        isOpen={showModal}
        modalHeading={activityName}
        secondaryButtonText={openAddModal ? 'Back to Details' : 'Cancel'}
        primaryButtonText={openAddModal ? 'Save' : 'Rollout'}
        onPrimaryButtonClick={handleActivityRollout}
        onSecondaryButtonClick={() => (openAddModal ? handleBackToDetails() : setShowModal(false))}
        onRequestClose={() => setShowModal(false)}
      >
        {openAddModal ? (
          <RolloutGapDetails handleAddGroups={handleAddGroups} handleAddAttributes={handleAddAttributes} handleAddPartners={handleAddPartners} rolloutGapData={rolloutGapData} />
        ) : (
          <RolloutDetails {...props} rolloutDetails={rolloutDetails} setRolloutDetails={setRolloutDetails} handleAddClick={() => setOpenAddModal(true)} />
        )}
      </GenericModal>
    </>
  );
};

export default ActivityRolloutModal;
