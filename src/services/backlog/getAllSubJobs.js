import api from '../../api/api';

const getAllSubJobs = async (JobNo) => {
  const res = await api.post('/backlog/getAllSubJobs', {
    JobNo: JobNo
  });
  return res.data
};

export default getAllSubJobs;