import api from '../../api/api';

const updateTLStatus = async (jobNo, tlStatus) => {
  const res = await api.post('/tlaser/updateTLStatus', {
    jobNo: jobNo, 
    tlStatus: tlStatus,
  });
  return res;
}

export default updateTLStatus;