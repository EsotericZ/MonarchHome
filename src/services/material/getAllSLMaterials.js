import api from '../../api/api';

const getAllSLMaterials = async () => {
  const res = await api.get('/material/getAllSLMaterials');
  return res.data
};

export default getAllSLMaterials;