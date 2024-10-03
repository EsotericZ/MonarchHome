import api from '../../api/api';

const updateJob = async (jobNo, engineer, jobStatus) => {
    const res = await api.post('/engineering/updateJob', {
        jobNo: jobNo, 
        engineer: engineer,
        jobStatus: jobStatus,
    });
    return res.data;
}

export default updateJob;