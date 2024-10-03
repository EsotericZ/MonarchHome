import api from '../../api/api';

const updateEngineering = async (id) => {
    const res = await api.post('/users/updateEngineering', {
        id: id
    });
    return res.data;
}

export default updateEngineering;