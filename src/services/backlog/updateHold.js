import api from '../../api/api';

const updateHold = async (id) => {
  const res = await api.post('/backlog/updateHold', {
    id: id
  });
  return res.data;
}

export default updateHold;