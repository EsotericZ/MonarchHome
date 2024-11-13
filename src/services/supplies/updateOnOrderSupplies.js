import api from '../../api/api';

const updateOnOrderSupplies = async (id) => {
    const res = await api.post('/supplies/updateOnOrderSupplies', {
        id: id
    });
    return res.data;
}

export default updateOnOrderSupplies;