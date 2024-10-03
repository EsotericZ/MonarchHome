import api from '../../api/api';

const getFutureJobs = async () => {
    const res = await api.get('/engineering/getFutureJobs');
    return res.data
};

export default getFutureJobs;