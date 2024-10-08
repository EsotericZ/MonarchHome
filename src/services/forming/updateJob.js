import api from '../../api/api';

const updateJob = async (jobNo, formProgrammer, formStatus, notes) => {
  const res = await api.post('/forming/updateJob', {
    jobNo: jobNo,
    formProgrammer: formProgrammer,
    formStatus: formStatus,
    notes: notes,
  });
  return res.data;
}

export default updateJob;