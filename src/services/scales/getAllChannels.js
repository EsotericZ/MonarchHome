import apiScales from "../../api/apiScales";

const getAllChannels = async () => {
  const res = await apiScales.get('/scale_api/Scale/GetChannelConnections');
  return res.data;
}

export default getAllChannels;