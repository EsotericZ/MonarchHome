import api from '../../api/api';

const updateMaterialsDate = async (id, date) => {
  const res = await api.post('/material/updateMaterialsDate', {
    id,
    date,
  });
  return res.data;
}

export default updateMaterialsDate;