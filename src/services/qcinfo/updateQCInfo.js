import api from '../../api/api';

const updateQCInfo = async (id, custCode, coc, matlCert, platCert, addInfo, notes) => {
    const res = await api.post('/qcinfo/updateQCInfo', {
        id,
        custCode, 
        coc,
        matlCert,
        platCert,
        addInfo,
        notes, 
    });
    return res.data;
}

export default updateQCInfo;