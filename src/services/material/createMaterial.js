import api from '../../api/api';

const createMaterial = async (programNo, material, jobNo, machine, area) => {
  const res = await api.post('/material/createMaterial', {
    programNo,
    material,
    jobNo,
    machine,
    area
  });
  return res.data;
}

export default createMaterial;