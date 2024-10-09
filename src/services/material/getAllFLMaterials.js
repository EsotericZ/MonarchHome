import api from '../../api/api';

const getAllFLMaterials = async () => {
  const res = await api.get('/material/getAllFLMaterials');
  return res.data
};

export default getAllFLMaterials;