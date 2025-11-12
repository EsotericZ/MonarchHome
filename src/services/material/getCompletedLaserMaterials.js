import api from '../../api/api';

const getCompletedLaserMaterials = async () => {
  const res = await api.get('/material/getCompletedLaserMaterials');
  return res.data
};

export default getCompletedLaserMaterials;