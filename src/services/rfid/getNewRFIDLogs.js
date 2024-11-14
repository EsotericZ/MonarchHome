import apiRFID from '../../api/apiRFID';

const getNewRFIDLogs = async () => {
  const res = await apiRFID.get('/logs/getNewLogs');
  return res.data;
}

export default getNewRFIDLogs;