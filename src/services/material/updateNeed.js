import api from '../../api/api';

const updateNeed = async (id) => {
  const res = await api.post('/material/updateNeed', {
    id: id
  });
  return res.data;
}

export default updateNeed;