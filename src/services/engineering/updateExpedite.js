import api from '../../api/api';

const updateExpedite = async (id) => {
    const res = await api.post('/engineering/updateExpedite', {
        id: id
    });
    return res.data;
}

export default updateExpedite;