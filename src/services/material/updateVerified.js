import api from '../../api/api';

const updateVerified = async (id) => {
  const res = await api.post('/material/updateVerified', {
    id: id
  });
  return res.data;
}

export default updateVerified;