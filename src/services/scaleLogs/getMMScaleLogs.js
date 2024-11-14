import api from '../../api/api';

const getMMScaleLogs = async () => {
  const res = await api.get('/scaleLog/getMMScaleLogs');
  return res.data;
}

export default getMMScaleLogs;