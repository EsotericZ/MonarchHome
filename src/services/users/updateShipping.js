import api from '../../api/api';

const updateShipping = async (id) => {
    const res = await api.post('/users/updateShipping', {
        id: id
    });
    return res.data;
}

export default updateShipping;