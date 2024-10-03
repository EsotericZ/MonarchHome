import api from '../../api/api';

const updateSaw = async (id) => {
    const res = await api.post('/users/updateSaw', {
        id: id
    });
    return res.data;
}

export default updateSaw;