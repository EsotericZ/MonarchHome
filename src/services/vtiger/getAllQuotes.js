import api from '../../api/api';

const getAllQuotes = async () => {
  const res = await api.get('/vtiger/getAllQuotes');
  return res.data
};

export default getAllQuotes;