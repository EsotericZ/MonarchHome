import api from '../../api/api';

const getStandardTaps = async () => {
    const res = await api.get('/taps/getStandardTaps');
    return res.data
};

export default getStandardTaps;