import api from '../../api/api';

const updatePurchasing = async (id) => {
    const res = await api.post('/users/updatePurchasing', {
        id: id
    });
    return res.data;
}

export default updatePurchasing;