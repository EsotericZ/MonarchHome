import api from '../../api/api';

const createTask = async (assignedById, assignedToIds, taskName, description, priority, status) => {
  const res = await api.post('/tasks/createTask', {
    assignedBy: assignedById, 
    assignedTo: assignedToIds, 
    taskName,
    description, 
    priority, 
    status
  });
  return res.data;
}

export default createTask;