import api from '../../api/api';

const getAllPOsPO = async (poNum) => {
  const res = await api.post('/sheetInventory/getAllPOsPO', {
    poNum: poNum,
  });
  return res.data
};

export default getAllPOsPO;