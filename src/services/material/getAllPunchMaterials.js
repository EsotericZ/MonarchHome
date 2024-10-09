import api from '../../api/api';

const getAllPunchMaterials = async () => {
  const res = await api.get('/material/getAllPunchMaterials');
  return res.data
};

export default getAllPunchMaterials;