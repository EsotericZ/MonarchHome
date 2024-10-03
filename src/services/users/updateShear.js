import api from '../../api/api';

const updateShear = async (id) => {
    const res = await api.post('/users/updateShear', {
        id: id
    });
    return res.data;
}

export default updateShear;