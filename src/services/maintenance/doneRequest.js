import api from '../../api/api';

const doneRequest = async (record, done) => {
  const res = await api.post('/maintenance/doneRequest', {
    record,
    done,
  });
  return res.data;
}

export default doneRequest;