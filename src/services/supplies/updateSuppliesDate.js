import api from '../../api/api';

const updateSuppliesDate = async (id, date) => {
    const res = await api.post('/supplies/updateSuppliesDate', {
        id, 
        date,
    });
    return res.data;
}

export default updateSuppliesDate;