import api from '../../api/api';

const getAllContacts = async () => {
  const res = await api.get('/vtiger/getAllContacts');
  return res.data
};

export default getAllContacts;