import api from '../../api/api';

const createMMItem = async (radioScaleId, newItemId, itemName, itemLocation, itemAlert, itemRack, itemShelf, itemBin, itemArea) => {
  const res = await api.post('/scales/createMMItem', {
    scaleId: radioScaleId,
    itemId: newItemId,
    itemName: itemName,
    itemLocation: itemLocation,
    alert: itemAlert,
    rack: itemRack,
    shelf: itemShelf,
    bin: itemBin,
    area: itemArea,
  });
  return res.data;
}

export default createMMItem;