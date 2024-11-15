import apiScales from '../../api/apiScales';

const zeroScale = async (data) => {
  try {
    const res = await apiScales.post(`/scale_api/Scale/ZeroScale/${data}`)

    return res.data;
  } catch (err) {
    console.error(err)
  }
}

export default zeroScale;