import api from '../../api/api';

const createPort = async (newPort) => {
  const res = await api.post('/scales/createPort', newPort);
  return res.data;
}

export default createPort;