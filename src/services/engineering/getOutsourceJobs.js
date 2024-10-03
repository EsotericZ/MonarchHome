import api from '../../api/api';

const getOutsourceJobs = async () => {
    const res = await api.get('/engineering/getOutsourceJobs');
    return res.data
};

export default getOutsourceJobs;