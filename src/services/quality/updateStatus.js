import api from '../../api/api';

const updateStatus = async (jobNo, jobStatus) => {
    const res = await api.post('/quality/updateStatus', {
        jobNo: jobNo, 
        jobStatus: jobStatus,
    });
    return res.data;
}

export default updateStatus;