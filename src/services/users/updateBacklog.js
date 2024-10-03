import api from '../../api/api';

const updateBacklog = async (id) => {
    const res = await api.post('/users/updateBacklog', {
        id: id
    });
    return res.data;
}

export default updateBacklog;