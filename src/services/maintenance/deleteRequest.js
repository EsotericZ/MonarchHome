import api from '../../api/api';

const deleteRequest = async (record) => {
  const res = await api.post('/maintenance/deleteRequest', {
    record,
  });
  return res.data;
}

export default deleteRequest;