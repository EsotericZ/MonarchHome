import api from '../../api/api';

const updateRecieved = async (id) => {
    const res = await api.post('/supplies/updateRecieved', {
        id: id
    });
    return res.data;
}

export default updateRecieved;