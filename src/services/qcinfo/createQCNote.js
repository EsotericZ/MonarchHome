import api from '../../api/api';

const createQCNote = async (custCode, coc, matlCert, platCert, addInfo, notes) => {
    const res = await api.post('/qcinfo/createQCNote', {
        custCode,
        coc,
        matlCert,
        platCert,
        addInfo,
        notes, 
    });
    return res.data;
}

export default createQCNote;