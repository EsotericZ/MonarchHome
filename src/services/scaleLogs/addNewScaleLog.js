import api from '../../api/api';

const addNewScaleLog = async (log) => {
  const res = await api.post('/scaleLog/addNewScaleLog', {
    scaleName: log.ScaleName,
    itemLocation: log.ItemName,
    oldQty: log.OldQuantity,
    newQty: log.NewQuantity,
    employee: log.EmployeeName.trim(),
    timeStamp: log.Timestamp,
  });
  return res.data;
}

export default addNewScaleLog;