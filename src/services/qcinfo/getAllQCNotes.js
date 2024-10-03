import api from '../../api/api';

const getAllQCNotes = async () => {
    const res = await api.get('/qcinfo/getAllQCNotes');
    return res.data
};

export default getAllQCNotes;