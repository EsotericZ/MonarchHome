import api from '../../api/api';

const getOneCustomer = async (custCode) => {
  const res = await api.post('/vtiger/getOneCustomer', {
    custCode: custCode,
  });
  return res.data
};

export default getOneCustomer;