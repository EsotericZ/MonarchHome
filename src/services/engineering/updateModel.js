import api from '../../api/api';

const updateModel = async (id) => {
    const res = await api.post('/engineering/updateModel', {
        id: id
    });
    return res.data;
}

export default updateModel;