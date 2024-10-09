import api from '../../api/api';

const updateOnOrder = async (id) => {
  const res = await api.post('/material/updateOnOrder', {
    id: id
  });
  return res.data;
}

export default updateOnOrder;