import api from '../../api/api';

const holdRequest = async (record, requestHold, approvedBy) => {
  const res = await api.post('/maintenance/holdRequest', {
    requestHold: requestHold,
    record: record,
    approvedBy: approvedBy,
  });
  return res.data;
}

export default holdRequest;