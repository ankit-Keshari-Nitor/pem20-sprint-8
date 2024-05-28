export const NEW_ACTIVITY_URL = '#/activities/new';

export const API_URL = {
  ACTIVITY_DEFINITION: '/sponsors/cashbank/v2/activityDefinitions'
};

export const ACTION_COLUMN_KEYS = {
  NAME: 'name',
  ENCRYPTED: 'encrypted',
  STATUS: 'status',
  VERSION: 'version',
  ACTIONS: 'action',
  ELLIPSIS: 'ellipsis',
  ROLLOUT: 'rollout',
  SAVE_AS: 'saveas',
  VIEW: 'view',
  TEST: 'test',
  DELETE: 'delete',
  SHARE_UNSHARE: 'shareunshare',
  EXPORT: 'export',
  MARK_AS_FINAL: 'markasfinal',
  EDIT: 'edit'
};

export const ACTIVITY_LIST_COLUMNS = [
  { key: ACTION_COLUMN_KEYS.NAME, header: 'Activity Name' },
  { key: ACTION_COLUMN_KEYS.ENCRYPTED, header: 'Encrypted' },
  { key: ACTION_COLUMN_KEYS.STATUS, header: 'Current Status' },
  { key: ACTION_COLUMN_KEYS.VERSION, header: 'Default Version' },
  { key: ACTION_COLUMN_KEYS.ACTIONS, header: 'Actions' },
  { key: ACTION_COLUMN_KEYS.ELLIPSIS, header: '' }
];

export const ACTION_COLUMN_FINAL = [
  { key: ACTION_COLUMN_KEYS.ROLLOUT, label: 'Rollout' },
  { key: ACTION_COLUMN_KEYS.SAVE_AS, label: 'Save As' },
  { key: ACTION_COLUMN_KEYS.VIEW, label: 'View' },
  { key: ACTION_COLUMN_KEYS.TEST, label: 'Test' },
  { key: ACTION_COLUMN_KEYS.DELETE, label: 'Delete' },
  { key: ACTION_COLUMN_KEYS.SHARE_UNSHARE, label: 'Share/Unshare' },
  { key: ACTION_COLUMN_KEYS.EXPORT, label: 'Export' }
];

export const ACTION_COLUMN_DRAFT = [
  { key: ACTION_COLUMN_KEYS.ROLLOUT, label: 'Rollout' },
  { key: ACTION_COLUMN_KEYS.MARK_AS_FINAL, label: 'Mark as final' },
  { key: ACTION_COLUMN_KEYS.SAVE_AS, label: 'Save As' },
  { key: ACTION_COLUMN_KEYS.EDIT, label: 'Edit' },
  { key: ACTION_COLUMN_KEYS.TEST, label: 'Test' },
  { key: ACTION_COLUMN_KEYS.DELETE, label: 'Delete' },
  { key: ACTION_COLUMN_KEYS.EXPORT, label: 'Export' }
];

export const ROLLOUT_STEPS = [
  {
    id: 'step1',
    label: 'Step 1',
    secondaryLabel: 'Rollout details'
  },
  {
    id: 'step2',
    label: 'Step 2',
    secondaryLabel: 'Select Group, Attributes, Partners'
  }
];

export const GROUP_LIST_DATA = [
  { key: 'Group-1_Mapping_delete', value: 'Group-1_Mapping_delete' },
  { key: 'Group-2_Mapping_View', value: 'Group-2_Mapping_View' },
  { key: 'Group-3_Mapping_secAdmin', value: 'Group-3_Mapping_secAdmin' },
  { key: 'Group-4_Mapping_Edit', value: 'Group-4_Mapping_Edit' },
  { key: 'Group-2_Mapping_delete_Notap', value: 'Group-2_Mapping_delete_Notap' },
  { key: 'Group-1_SecAdmin_Appli', value: 'Group-1_SecAdmin_Appli' },
  { key: 'Group-4_SecAdmin_Appli', value: 'Group-4_SecAdmin_Appli' },
  { key: 'Group-12_Mapping_View', value: 'Group-12_Mapping_View' }
];

export const ATTRIBUTE_LIST_DATA = [
  { key: 'Attribute-1_Mapping_delete', value: 'Attribute-1_Mapping_delete' },
  { key: 'Attribute-2_Mapping_View', value: 'Attribute-2_Mapping_View' },
  { key: 'Attribute-3_Mapping_secAdmin', value: 'Attribute-3_Mapping_secAdmin' },
  { key: 'Attribute-4_Mapping_Edit', value: 'Attribute-4_Mapping_Edit' },
  { key: 'Attribute-2_Mapping_delete_Notap', value: 'Attribute-2_Mapping_delete_Notap' },
  { key: 'Attribute-1_SecAdmin_Appli', value: 'Attribute-1_SecAdmin_Appli' },
  { key: 'Attribute-4_SecAdmin_Appli', value: 'Attribute-4_SecAdmin_Appli' },
  { key: 'Attribute-12_Mapping_View', value: 'Attribute-12_Mapping_View' }
];

export const PARTNER_LIST_DATA = [
  { key: 'Partner-1_Mapping_delete', value: 'Partner-1_Mapping_delete' },
  { key: 'Partner-2_Mapping_View', value: 'Partner-2_Mapping_View' },
  { key: 'Partner-3_Mapping_secAdmin', value: 'Partner-3_Mapping_secAdmin' },
  { key: 'Partner-4_Mapping_Edit', value: 'Partner-4_Mapping_Edit' },
  { key: 'Partner-2_Mapping_delete_Notap', value: 'Partner-2_Mapping_delete_Notap' },
  { key: 'Partner-1_SecAdmin_Appli', value: 'Partner-1_SecAdmin_Appli' },
  { key: 'Partner-4_SecAdmin_Appli', value: 'Partner-4_SecAdmin_Appli' },
  { key: 'Partner-12_Mapping_View', value: 'Partner-12_Mapping_View' }
];
