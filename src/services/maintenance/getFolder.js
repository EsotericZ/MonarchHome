import api from '../../api/api';

const getFolder = async (folderName) => {
  try {
    await api.get(`/maintenance/getFolder/${folderName}`);
  } catch (error) {
    'Error fetching folder';
  }
}

export default getFolder;