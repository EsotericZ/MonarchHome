import api from '../../api/api';

const createTaskNote = async (taskId, note, name, date) => {
  const res = await api.post('/tasks/createTaskNote', {
    taskId, 
    note, 
    name, 
    date
  });
  return res.data;
}

export default createTaskNote;