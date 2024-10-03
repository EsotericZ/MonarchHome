import api from '../../api/api';

const updateQuality = async (id) => {
    const res = await api.post('/users/updateQuality', {
        id: id
    });
    return res.data;
}

export default updateQuality;