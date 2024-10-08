import api from '../../api/api';

const getPrints = async () => {
  const res = await api.get('/engineering/getPrints');
  return res.data
};

export default getPrints;