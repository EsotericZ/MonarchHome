import api from '../../api/api';

const updateEmail = async (id) => {
  const res = await api.post('/backlog/updateEmail', {
    id: id
  });
  return res.data;
}

export default updateEmail;