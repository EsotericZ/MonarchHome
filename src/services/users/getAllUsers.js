import api from '../../api/api';

const getAllUsers = async () => {
    const res = await api.get('/users/getAllUsers');
    return res.data
};

export default getAllUsers;