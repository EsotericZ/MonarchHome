import api from '../../api/api';

const getAllPOsDate = async (startDate, endDate) => {
  const res = await api.post('/sheetInventory/getAllPOsDate', {
    startDate: startDate,
    endDate: endDate,
  });
  return res.data
};

export default getAllPOsDate;