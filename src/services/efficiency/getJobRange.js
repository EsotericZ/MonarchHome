import api from '../../api/api';

const getJobRange = async (StartJobNo, FinishJobNo) => {
  const res = await api.post('/efficiency/getJobRange', {
    StartJobNo,
    FinishJobNo
  });
  return res.data
};

export default getJobRange;