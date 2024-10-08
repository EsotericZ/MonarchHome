import api from '../../api/api';

const updateTLProgrammer = async (jobNo, tlProgrammer) => {
  const res = await api.post('/tlaser/updateTLProgrammer', {
    jobNo: jobNo, 
    tlProgrammer: tlProgrammer,
  });
  return res;
}

export default updateTLProgrammer;