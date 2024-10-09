import api from '../../api/api';

const getAllTLMaterials = async () => {
  const res = await api.get('/material/getAllTLMaterials');
  return res.data
};

export default getAllTLMaterials;