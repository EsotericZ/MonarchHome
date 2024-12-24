import api from '../../api/api';

const approveRequest = async (record, approvedBy, requestHold) => {
  const res = await api.post('/maintenance/approveRequest', {
    approvedBy: approvedBy,
    record: record,
    requestHold: requestHold,
  });
  return res.data;
}

export default approveRequest;