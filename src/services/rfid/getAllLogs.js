import apiRFID from '../../api/apiRFID';

const getRFIDLogs = async () => {
  const res = await apiRFID.get('/logs/getAllLogs');
  return res.data;
}

export default getRFIDLogs;