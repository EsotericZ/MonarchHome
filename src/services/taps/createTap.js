import api from '../../api/api';

const createTap = async (tapName, holeSize, type, notes) => {
    const res = await api.post('/taps/createTap', {
        tapName, 
        holeSize, 
        type,
        notes,
    });
    return res.data;
}

export default createTap;