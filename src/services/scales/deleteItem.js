import apiScales from "../../api/apiScales";

const deleteItem = async (data) => {
  const res = await apiScales.post(`/scale_api/Scale/DeleteItem/${data}`)

  return res.data;
}

export default deleteItem;