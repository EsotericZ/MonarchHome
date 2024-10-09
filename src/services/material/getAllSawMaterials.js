import api from '../../api/api';

const getAllSawMaterials = async () => {
  const res = await api.get('/material/getAllSawMaterials');
  return res.data
};

export default getAllSawMaterials;