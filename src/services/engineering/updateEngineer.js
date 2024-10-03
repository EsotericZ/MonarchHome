import api from '../../api/api';

const updateEngineer = async (jobNo, engineer) => {
    const res = await api.post('/engineering/updateEngineer', {
        jobNo: jobNo, 
        engineer: engineer,
    });
    return res;
}

export default updateEngineer;