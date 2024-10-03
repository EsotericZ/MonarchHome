import api from '../../api/api';

const updateJobStatus = async (jobNo, jobStatus) => {
    const res = await api.post('/engineering/updateJobStatus', {
        jobNo: jobNo, 
        jobStatus: jobStatus,
    });
    return res;
}

export default updateJobStatus;