import api from '../../api/api';

const getSingleJob = async (JobNo) => {
  const res = await api.post('/efficiency/getSingleJob', {
    JobNo
  });
  return res.data
};

export default getSingleJob;