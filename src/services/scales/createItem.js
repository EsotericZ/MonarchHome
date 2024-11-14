import apiScales from "../../api/apiScales";

const createItem = async (data) => {
  try {
    const res = await apiScales.post('/scale_api/Scale/CreateItem', data, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return res.data;
  } catch (err) {
    console.error(err)
  }
}

export default createItem;