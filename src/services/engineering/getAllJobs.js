import api from '../../api/api';

const getAllJobs = async () => {
    const res = await api.get('/engineering/getAllJobs');
    return res.data
};

export default getAllJobs;