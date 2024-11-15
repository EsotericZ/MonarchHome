import apiScales from '../../api/apiScales';

const getScaleLogs = async () => {
  const res = await apiScales.get('/scale_api/Scale/GetLogs');
  return res.data;
}

export default getScaleLogs;