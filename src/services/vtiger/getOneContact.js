import api from '../../api/api';

const getOneContact = async (custCode) => {
  const res = await api.post('/vtiger/getOneContact', {
    custCode: custCode,
  });
  return res.data
};

export default getOneContact;