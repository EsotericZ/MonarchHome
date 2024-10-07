import api from '../../api/api';

const updateTap = async (id, tapName, holeSize, type, notes) => {
    const res = await api.post('/taps/updateTap', {
        id,
        tapName, 
        holeSize, 
        type,
        notes,
    });
    return res.data;
}

export default updateTap;