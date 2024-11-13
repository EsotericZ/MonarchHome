import api from '../../api/api';

const updateSpecialty = async (id) => {
    const res = await api.post('/users/updateSpecialty', {
        id: id
    });
    return res.data;
}

export default updateSpecialty;