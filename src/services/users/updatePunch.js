import api from '../../api/api';

const updatePunch = async (id) => {
    const res = await api.post('/users/updatePunch', {
        id: id
    });
    return res.data;
}

export default updatePunch;