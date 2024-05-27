export const NEW_ACTIVITY_URL = '#/activities/new';

export const API_URL = {
  ACTIVITY_DEFINITION: '/sponsors/cashbank/v2/activityDefinitions'
};

export const ACTIVITY_LIST_COLUMNS = [
  { key: 'name', header: 'Activity Name' },
  { key: 'encrypted', header: 'Encrypted' },
  { key: 'status', header: 'Current Status' },
  { key: 'version', header: 'Default Version' },
  { key: 'action', header: 'Action' },
  { key: 'ellipsis', header: '' }
];

export const ACTION_COLUMN_FINAL = [
  { key: 'rollout', label: 'Rollout' },
  { key: 'saveas', label: 'Save As' },
  { key: 'view', label: 'View' },
  { key: 'test', label: 'Test' },
  { key: 'delete', label: 'Delete' },
  { key: 'shareunshare', label: 'Share/Unshare' },
  { key: 'export', label: 'Export' }
];

export const ACTION_COLUMN_DRAFT = [
  { key: 'markasfinal', label: 'Mark as final' },
  { key: 'saveas', label: 'Save As' },
  { key: 'edit', label: 'Edit' },
  { key: 'test', label: 'Test' },
  { key: 'delete', label: 'Delete' },
  { key: 'export', label: 'Export' }
];