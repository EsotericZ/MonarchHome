import api from '../../api/api';

const getAllShearMaterials = async () => {
  const res = await api.get('/material/getAllShearMaterials');
  return res.data
};

export default getAllShearMaterials;