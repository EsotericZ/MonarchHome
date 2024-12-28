import api from '../../api/api';

const addMaintenanceNote = async (newNote) => {
  const res = await api.post('/maintenance/addMaintenanceNote', newNote);
  return res.data;
}

export default addMaintenanceNote;