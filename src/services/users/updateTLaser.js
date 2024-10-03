import api from '../../api/api';

const updateTLaser = async (id) => {
    const res = await api.post('/users/updateTLaser', {
        id: id
    });
    return res.data;
}

export default updateTLaser;