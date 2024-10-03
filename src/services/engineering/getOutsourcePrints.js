import api from '../../api/api';

const getOutsourcePrints = async () => {
    const res = await api.get('/engineering/getOutsourcePrints');
    return res.data
};

export default getOutsourcePrints;