import { useEffect, useState } from 'react';
import { Box } from '@mui/material';

import { useUserContext } from '../../context/UserContext';

import AddButton from '../../components/shared/AddButton';
import AddRequestModal from '../../components/maintenance/AddRequestModal';
import CustomTabs from '../../components/shared/CustomTabs';
import EditRequestModal from '../../components/maintenance/EditRequestModal';
import HoldCard from '../../components/maintenance/HoldCard';
import MaintenanceCard from '../../components/maintenance/MaintenanceCard';
import MaintenanceTable from '../../components/maintenance/MaintenanceTable';
import NotesModal from '../../components/maintenance/NotesModal';
import PageContainer from '../../components/shared/PageContainer';
import RefreshButton from '../../components/shared/RefreshButton';
import RequestCard from '../../components/maintenance/RequestCard';

import approveRequest from '../../services/maintenance/approveRequest';
import createRequest from '../../services/maintenance/createRequest';
import deleteRequest from '../../services/maintenance/deleteRequest';
import denyRequest from '../../services/maintenance/denyRequest';
import doneRequest from '../../services/maintenance/doneRequest';
import getAllEquipment from '../../services/maintenance/getAllEquipment';
import getAllRequests from '../../services/maintenance/getAllRequests';
import holdRequest from '../../services/maintenance/holdRequest';
import updateRequest from '../../services/maintenance/updateRequest';

export const Maintenance = () => {
  const { cookieData } = useUserContext();
  const [selectedTab, setSelectedTab] = useState(0);
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showAddRequest, setShowAddRequest] = useState(false);
  const [formData, setFormData] = useState({});
  const [equipment, setEquipment] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [maintenanceNotes, setMaintenanceNotes] = useState([]);

  const [active, setActive] = useState('Active');
  const [request, setRequest] = useState('Request');
  const [hold, setHold] = useState('Hold');

  const handleComplete = async (recordId) => {
    try {
      await doneRequest(recordId, true);
    } catch (error) {
      console.error('Error saving request:', error);
    } finally {
      setShowNotesModal(false);
      fetchData();
    }
  }

  const handleHoldModal = async (recordId) => {
    try {
      await holdRequest(recordId, true, '');
    } catch (error) {
      console.error('Error saving request:', error);
    } finally {
      setShowNotesModal(false);
      fetchData();
    }
  }

  const handleApprove = async (maintenance) => {
    try {
      await approveRequest(maintenance.record, cookieData.name);
    } catch (error) {
      console.error('Error saving request:', error);
    } finally {
      fetchData();
    }
  }

  const handleDeny = async (maintenance) => {
    try {
      await denyRequest(maintenance.record, true, 'Request Denied');
    } catch (error) {
      console.error('Error saving request:', error);
    } finally {
      fetchData();
    }
  }

  const handleDelete = async (maintenance) => {
    try {
      await deleteRequest(maintenance.record);
    } catch (error) {
      console.error('Error saving request:', error);
    } finally {
      fetchData();
    }
  }

  const handleHold = async (maintenance) => {
    try {
      await holdRequest(maintenance.record, true, '');
    } catch (error) {
      console.error('Error saving request:', error);
    } finally {
      fetchData();
    }
  }

  const handleUnholdApprove = async (maintenance) => {
    try {
      await approveRequest(maintenance.record, cookieData.name);
    } catch (error) {
      console.error('Error saving request:', error);
    } finally {
      fetchData();
    }
  }

  const handleClose = () => {
    setShowAddRequest(false);
    setShowEdit(false);
  }

  const handleChangeAddRequest = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveAddRequest = async () => {
    try {
      await createRequest(formData);
    } catch (error) {
      console.error('Error saving request:', error);
    } finally {
      setShowAddRequest(false);
      setFormData({});
      fetchData();
    }
  };

  const handleCloseAddRequest = () => {
    setShowAddRequest(false);
    setFormData({});
  };

  const handleShowAddRequest = () => {
    setFormData({
      requestedBy: cookieData.name,
      area: '',
      equipment: '',
      requestType: '',
      description: '',
    });
    setShowAddRequest(true);
  };

  const handleEdit = (request) => {
    setFormData({
      requestedBy: request.requestedBy || '',
      area: request.area || '',
      equipment: request.equipment || '',
      requestType: request.requestType || '',
      description: request.description || '',
      comments: request.comments || '',
      record: request.record || '',
      priority: request.priority || '',
    });
    setShowEdit(true);
  };

  const handleChangeEditRequest = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveEditRequest = async () => {
    try {
      await updateRequest(formData, formData.record);
    } catch (error) {
      console.error('Error updating request:', error);
    } finally {
      setShowEdit(false);
      setFormData({});
      fetchData();
    }
  };





  const handleAddNote = async (recordId, note) => {
    try {
      const newNote = {
        maintenanceId: recordId,
        note,
        name: cookieData.name,
        date: new Date().toISOString(),
      };
      // API call to save the note
      // await saveNoteAPI(newNote);
  
      setMaintenanceNotes((prevNotes) => [...prevNotes, newNote]);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };
  
  const handleOpenNotesModal = (record) => {
    setSelectedRecord(record);
    setShowNotesModal(true);
  };
  
  const handleCloseNotesModal = () => {
    setShowNotesModal(false);
    setSelectedRecord(null);
  };








  const [searchTerms, setSearchTerms] = useState({
    record: '',
    area: '',
    equipment: '',
    type: '',
  });

  const handleSearchChange = (field, value) => {
    setSearchTerms((prev) => ({ ...prev, [field]: value }));
  };

  const filteredRequests = allRequests
    .filter((request) => request.done)
    .filter((request) => {
      return (
        request.record.toString().includes(searchTerms.record) &&
        (request.area || '').toLowerCase().includes(searchTerms.area.toLowerCase()) &&
        (request.equipment || '').toLowerCase().includes(searchTerms.equipment.toLowerCase()) &&
        (request.requestType || '').toLowerCase().includes(searchTerms.type.toLowerCase())
      );
    });

  const fetchData = async () => {
    try {
      const [equipmentData, requestData] = await Promise.all([
        getAllEquipment(),
        getAllRequests(),
      ]);

      setEquipment(equipmentData || []);
      setAllRequests(requestData.data || []);

      let activeCount = requestData.data.filter(row => !row.done && !row.hold && row.approvedBy).length;
      setActive(activeCount > 0 ? `Active (${activeCount})` : 'Active');
      let requestCount = requestData.data.filter(row => !row.done && !row.hold && !row.approvedBy).length;
      setRequest(requestCount > 0 ? `Request (${requestCount})` : 'Request');
      let holdCount = requestData.data.filter(row => !row.done && row.hold).length;
      setHold(holdCount > 0 ? `Hold (${holdCount})` : 'Hold');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageContainer loading={loading} title='Maintenance'>
      <CustomTabs
        selectedTab={selectedTab}
        handleTabChange={handleTabChange}
        tabLabels={[active, request, hold, 'Completed']}
      />

      <AddRequestModal
        open={showAddRequest}
        onClose={handleCloseAddRequest}
        onSave={handleSaveAddRequest}
        handleChange={handleChangeAddRequest}
        equipment={equipment}
        formData={formData}
        cookieData={cookieData}
      />

      <EditRequestModal
        open={showEdit}
        onClose={handleClose}
        onSave={handleSaveEditRequest}
        handleChange={handleChangeEditRequest}
        formData={formData}
        record={formData.record}
      />

      <NotesModal
        show={showNotesModal}
        handleClose={handleCloseNotesModal}
        record={selectedRecord}
        notes={maintenanceNotes}
        handleAddNote={handleAddNote}
        handleComplete={(recordId) => handleComplete(recordId)}
        handleHold={(recordId) => handleHoldModal(recordId)}
      />

      {selectedTab == 0 && (
        <Box
          sx={{
            padding: '12px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          {allRequests.map((request, index) => {
            if (!request.done && !request.hold && request.approvedBy) {
              return (
                <MaintenanceCard
                  key={index}
                  maintenance={{
                    area: request.area || 'N/A',
                    description: request.description || 'No description available',
                    requestType: request.requestType || 'N/A',
                    requestedBy: request.requestedBy || 'Unknown',
                    record: request.record || 'N/A',
                    equipment: request.equipment || 'Unknown',
                    priority: request.priority
                  }}
                  handleEdit={() => handleEdit(request)}
                  handleViewNotes={(maintenance) => handleOpenNotesModal(maintenance)}
                />
              )
            }
            return null;
          })}
          <AddButton onClick={handleShowAddRequest} />
          <RefreshButton onClick={fetchData} />
        </Box>
      )}

      {selectedTab == 1 && (
        <Box
          sx={{
            padding: '12px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          {allRequests.map((request, index) => {
            if (!request.done && !request.hold && !request.approvedBy) {
              return (
                <RequestCard
                  key={index}
                  request={{
                    area: request.area || 'N/A',
                    description: request.description || 'No description available',
                    requestType: request.requestType || 'N/A',
                    requestedBy: request.requestedBy || 'Unknown',
                    record: request.record || 'N/A',
                    equipment: request.equipment || 'Unknown',
                    priority: request.priority,
                    maintenanceAccess: cookieData.maintenance || false,
                  }}
                  handleEdit={() => handleEdit(request)}
                  handleApprove={(maintenance) => handleApprove(maintenance)}
                  handleDeny={(maintenance) => handleDeny(maintenance)}
                  handleHold={(maintenance) => handleHold(maintenance)}
                />
              )
            }
            return null;
          })}
          <AddButton onClick={handleShowAddRequest} />
          <RefreshButton onClick={fetchData} />
        </Box>
      )}

      {selectedTab == 2 && (
        <Box
          sx={{
            padding: '12px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          {allRequests.map((request, index) => {
            if (!request.done && request.hold)
              return (
                <HoldCard
                  key={index}
                  request={{
                    area: request.area || 'N/A',
                    description: request.description || 'No description available',
                    requestType: request.requestType || 'N/A',
                    requestedBy: request.requestedBy || 'Unknown',
                    record: request.record || 'N/A',
                    equipment: request.equipment || 'Unknown',
                    priority: request.priority,
                    maintenanceAccess: cookieData.maintenance || false,
                  }}
                  handleEdit={() => handleEdit(request)}
                  handleApprove={(maintenance) => handleUnholdApprove(maintenance)}
                  handleDelete={(maintenance) => handleDelete(maintenance)}
                />
              )
          })}
        </Box>
      )}

      {selectedTab == 3 && (
        <Box sx={{ padding: '12px' }}>
          <MaintenanceTable
            records={filteredRequests}
            fallbackMessage='No Completed Maintenance Records'
            onRowClick={(record) => console.log('Clicked record:', record)}
            searchTerms={searchTerms}
            onSearchChange={handleSearchChange}
          />
        </Box>
      )}

    </PageContainer>
  );
}