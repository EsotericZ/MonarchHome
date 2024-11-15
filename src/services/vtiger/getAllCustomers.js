import api from '../../api/api';

const getAllCustomers = async () => {
  const res = await api.get('/vtiger/getAllCustomers');
  return res.data
};

export default getAllCustomers;