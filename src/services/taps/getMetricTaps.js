import api from '../../api/api';

const getMetricTaps = async () => {
    const res = await api.get('/taps/getMetricTaps');
    return res.data
};

export default getMetricTaps;