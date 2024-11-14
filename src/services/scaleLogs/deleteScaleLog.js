import api from '../../api/api';

const deleteScaleLog = async (record) => {
  console.log(record)
  const res = await api.post('/scaleLog/deleteScaleLog', {
    id: record.logid,
  });
  return res.data;
}

export default deleteScaleLog;