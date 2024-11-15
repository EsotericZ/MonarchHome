import apiScales from '../../api/apiScales';

const getAllSensors = async () => {
  const res = await apiScales.get('/scale_api/Scale/GetSensors');
  return res.data;
}

export default getAllSensors;