import apiScales from "../../api/apiScales";

const getAllScales = async () => {
  const res = await apiScales.get('/scale_api/Scale/GetScales');
  return res.data;
}

export default getAllScales;