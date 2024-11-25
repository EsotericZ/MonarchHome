import api from '../../api/api';

const createTask = async (assignedById, assignedToIds, description, priority, status) => {
  const res = await api.post('/tasks/createTask', {
    assignedBy: assignedById, 
    assignedTo: assignedToIds, 
    description, 
    priority, 
    status
  });
  return res.data;
}

export default createTask;