import api from '../../api/api';

const updateCheck = async (id) => {
  const res = await api.post('/material/updateCheck', {
    id: id
  });
  return res.data;
}

export default updateCheck;