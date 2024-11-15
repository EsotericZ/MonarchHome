import apiScales from '../../api/apiScales';

const deleteScale = async (data) => {
  try {
    const res = await apiScales.post(`/scale_api/Scale/DeleteScale/${data}`)

    return res.data;
  } catch (err) {
    console.error(err)
  }
}

export default deleteScale;