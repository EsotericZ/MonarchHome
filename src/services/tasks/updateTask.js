import api from '../../api/api';

const updateTask = async (id, assignedTo, taskName, description, priority, status) => {
  const res = await api.post('/tasks/updateTask', {
    id, 
    assignedTo, 
    taskName, 
    description, 
    priority, 
    status
  });
  return res.data;
}

export default updateTask;