import api from '../../api/api';

const deleteMMItem = async (itemId) => {
  const res = await api.post('/scales/deleteMMItem', {
    itemId
  });
  return res.data;
}

export default deleteMMItem;