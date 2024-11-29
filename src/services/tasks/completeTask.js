import api from '../../api/api';

const completeTask = async (taskId) => {
  const res = await api.post('/tasks/completeTask', {
    taskId
  });
  return res.data;
}

export default completeTask;