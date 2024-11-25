import api from '../../api/api';

const getUserTasks = async (userId) => {
  const res = await api.get(`/tasks/getUserTasks/${userId}`);
  return res.data
};

export default getUserTasks;