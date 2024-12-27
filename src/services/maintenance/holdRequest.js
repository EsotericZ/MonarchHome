import api from '../../api/api';

const holdRequest = async (record, requestHold, approvedBy) => {
  console.log(record, requestHold, approvedBy)
  const res = await api.post('/maintenance/holdRequest', {
    record,
    requestHold,
    approvedBy,
  });
  return res.data;
}

export default holdRequest;