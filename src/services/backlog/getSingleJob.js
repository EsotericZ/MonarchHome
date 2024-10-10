import api from '../../api/api';

const getSingleJob = async (JobNo) => {
  const res = await api.post('/backlog/getSingleJob', {
    JobNo: JobNo
  });
  return res.data
};

export default getSingleJob;