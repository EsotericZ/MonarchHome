import api from '../../api/api';

const getUserPassword = async (id) => {
    const res = await api.post('/users/getUserPassword', {
        id: id
});
    return res.data
};

export default getUserPassword;