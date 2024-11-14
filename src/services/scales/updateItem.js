import api from '../../api/api';

const updateItem = async (itemName, itemLocation, currentItemId, itemAlert, itemRack, itemShelf, itemBin, itemArea, itemSmall) => {
  const res = await api.post('/scales/updateItem', {
    itemName,
    itemLocation,
    currentItemId,
    itemAlert,
    itemRack,
    itemShelf,
    itemBin,
    itemArea,
    itemSmall
  });
  return res.data;
}

export default updateItem;