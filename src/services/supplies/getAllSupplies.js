import api from '../../api/api';

const getAllSupplies = async () => {
    const res = await api.get('/supplies/getAllSupplies');
    return res.data
};

export default getAllSupplies;