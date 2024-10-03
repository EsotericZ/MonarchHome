import api from '../../api/api';

const updateMachining = async (id) => {
    const res = await api.post('/users/updateMachining', {
        id: id
    });
    return res.data;
}

export default updateMachining;