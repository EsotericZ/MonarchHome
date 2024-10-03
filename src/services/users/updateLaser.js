import api from '../../api/api';

const updateLaser = async (id) => {
    const res = await api.post('/users/updateLaser', {
        id: id
    });
    return res.data;
}

export default updateLaser;