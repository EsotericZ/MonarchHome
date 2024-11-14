import api from '../../api/api';

const getAllPorts = async () => {
  const res = await api.get('/scales/getAllPorts');
  return res.data
};

export default getAllPorts;