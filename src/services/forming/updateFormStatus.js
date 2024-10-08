import api from '../../api/api';

const updateFormStatus = async (jobNo, formStatus) => {
  const res = await api.post('/forming/updateFormStatus', {
    jobNo: jobNo,
    formStatus: formStatus,
  });
  return res;
}

export default updateFormStatus;