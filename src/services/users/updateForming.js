import api from '../../api/api';

const updateForming = async (id) => {
    const res = await api.post('/users/updateForming', {
        id: id
    });
    return res.data;
}

export default updateForming;