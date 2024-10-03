import api from '../../api/api';

const getNextStep = async () => {
    const res = await api.get('/engineering/getNextStep');
    return res.data
};

export default getNextStep;