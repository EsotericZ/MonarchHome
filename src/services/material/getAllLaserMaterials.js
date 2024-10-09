import api from '../../api/api';

const getAllLaserMaterials = async () => {
  const res = await api.get('/material/getAllLaserMaterials');
  return res.data
};

export default getAllLaserMaterials;