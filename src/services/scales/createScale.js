import apiScales from '../../api/apiScales';

const createScale = async (data) => {
  try {
    const res = await apiScales.post('/scale_api/Scale/CreateScale', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return res.data;
  } catch (err) {
    console.error(err)
  }
}

export default createScale;