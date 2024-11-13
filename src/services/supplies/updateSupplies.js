import api from '../../api/api';

const updateSupplies = async (id, supplies, department, requestedBy, notes, productLink, jobNo) => {
    const res = await api.post('/supplies/updateSupplies', {
        id, 
        supplies, 
        department, 
        requestedBy, 
        notes, 
        productLink, 
        jobNo,
    });
    return res.data;
}

export default updateSupplies;