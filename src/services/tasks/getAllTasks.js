import api from '../../api/api';

const getAllTasks = async () => {
  const res = await api.get('/tasks/getAllTasks');
  return res.data
};

export default getAllTasks;