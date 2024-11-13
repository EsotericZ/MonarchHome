import api from '../../api/api';

const createSupplies = async (supplies, department, requestedBy, notes, productLink, jobNo) => {
    const res = await api.post('/supplies/createSupplies', {
        supplies, 
        department, 
        requestedBy, 
        notes, 
        productLink, 
        jobNo
    });
    return res.data;
}

export default createSupplies;