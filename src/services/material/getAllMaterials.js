import api from '../../api/api';

const getAllMaterials = async () => {
  const res = await api.get('/material/getAllMaterials');
  return res.data
};

export default getAllMaterials;