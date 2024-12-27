import api from '../../api/api';

const approveRequest = async (record, approvedBy) => {
  const res = await api.post('/maintenance/approveRequest', {
    record,
    approvedBy,
  });
  return res.data;
}

export default approveRequest;