import api from '../../api/api';

const getMMItems = async () => {
  const res = await api.get('/scales/getMMItems');
  return res.data;
};

export default getMMItems;