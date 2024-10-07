import api from '../../api/api';

const updateInspector = async (jobNo, inspector) => {
    const res = await api.post('/quality/updateInspector', {
        jobNo: jobNo, 
        inspector: inspector,
    });
    return res;
}

export default updateInspector;