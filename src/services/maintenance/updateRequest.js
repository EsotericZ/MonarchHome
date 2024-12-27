import api from '../../api/api';

const updateRequest = async (updateRequest, record) => {
  const res = await api.post('/maintenance/updateRequest', {
    updateRequest,
    record,
  });
  return res.data;
}

export default updateRequest;