import api from '../../api/api';

const updateFormProgrammer = async (jobNo, formProgrammer) => {
  const res = await api.post('/forming/updateFormProgrammer', {
    jobNo: jobNo,
    formProgrammer: formProgrammer,
  });
  return res;
}

export default updateFormProgrammer;