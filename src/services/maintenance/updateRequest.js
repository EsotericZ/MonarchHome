import api from '../../api/api';

const updateRequest = async (updateRequest, record) => {
  const res = await api.post('/maintenance/updateRequest', {
    updateRequest: updateRequest,
    record: record
  });
  return res.data;
}

export default updateRequest;