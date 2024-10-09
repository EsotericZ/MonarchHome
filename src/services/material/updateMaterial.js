import api from '../../api/api';

const updateMaterial = async (id, programNo, material, jobNo, machine) => {
  const res = await api.post('/material/updateMaterial', {
    id,
    programNo,
    material,
    jobNo,
    machine,
  });
  return res.data;
}

export default updateMaterial;