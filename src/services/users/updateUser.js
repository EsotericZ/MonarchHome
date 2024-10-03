import api from '../../api/api';

const updateUser = async (updateUser) => {
    const res = await api.post('/users/updateUser', {
        updateUser: updateUser
    });
    return res.data;
}

export default updateUser;