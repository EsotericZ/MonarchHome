import api from '../../api/api';

const getLastTwenty = async () => {
  const res = await api.get('/efficiency/getLastTwenty');
  return res.data
};

export default getLastTwenty;