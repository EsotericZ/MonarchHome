import api from '../../api/api';

const deleteUser = async (userData) => {
    const res = await api.post('/users/deleteUser', userData);
    return res.data;
}

export default deleteUser;