import { Box, Card, CardContent, Chip, Typography } from '@mui/material';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonIcon from '@mui/icons-material/Person';

const EmployeeCard = ({ user, handleOpenUpdate }) => {
  let backgroundColor;
  switch (user.role) {
    case 'admin':
      backgroundColor = 'lightgreen';
      break;
    case 'employee':
      backgroundColor = '#CDE3FD';
      break;
    case 'temp':
      backgroundColor = '#F75D59';
      break;
    default:
      backgroundColor = 'white';
      break;
  }

  return (
    <Card
      sx={{
        width: '400px',
        margin: '10px',
        padding: '10px',
        backgroundColor,
        cursor: 'pointer',
      }}
      onClick={() => handleOpenUpdate(user)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ flexShrink: 0 }}>
            {user.role === 'admin' ? (
              <ManageAccountsIcon sx={{ fontSize: 40 }} />
            ) : (
              <PersonIcon sx={{ fontSize: 40 }} />
            )}
          </Box>
          <Box sx={{ marginLeft: '20px' }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: '29px' }}>{user.name}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', marginTop: 1, marginLeft: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '17px' }}>Employee No:</Typography>
              <Typography sx={{ fontSize: '17px', marginLeft: '5px' }}>{user.number}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '17px' }}>RFID:</Typography>
              <Typography sx={{ fontSize: '17px', marginLeft: '5px' }}>
                {user.etch !== '-' ? (
                  <a
                    href="http://10.0.1.45:3000/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {user.etch}
                  </a>
                ) : (
                  <a
                    href="http://10.0.1.45:3000/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    None Assigned
                  </a>
                )}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: 2 }}>
          {user.engineering && (
            <Chip sx={{ fontSize: '13px', width: '105px', backgroundColor: 'gray', color: 'white', fontWeight: 'bold' }} label="Engineering" />
          )}
          {user.machining && (
            <Chip sx={{ fontSize: '13px', width: '105px', backgroundColor: 'gray', color: 'white', fontWeight: 'bold' }} label="Machining" />
          )}
          {user.quality && (
            <Chip sx={{ fontSize: '13px', width: '105px', backgroundColor: 'gray', color: 'white', fontWeight: 'bold' }} label="Quality" />
          )}
          {user.laser && (
            <Chip sx={{ fontSize: '13px', width: '105px', backgroundColor: 'gray', color: 'white', fontWeight: 'bold' }} label="Laser" />
          )}
          {user.forming && (
            <Chip sx={{ fontSize: '13px', width: '105px', backgroundColor: 'gray', color: 'white', fontWeight: 'bold' }} label="Forming" />
          )}
          {user.tlaser && (
            <Chip sx={{ fontSize: '13px', width: '105px', backgroundColor: 'gray', color: 'white', fontWeight: 'bold' }} label="TLaser" />
          )}
          {user.saw && (
            <Chip sx={{ fontSize: '13px', width: '105px', backgroundColor: 'gray', color: 'white', fontWeight: 'bold' }} label="Saw" />
          )}
          {user.punch && (
            <Chip sx={{ fontSize: '13px', width: '105px', backgroundColor: 'gray', color: 'white', fontWeight: 'bold' }} label="Punch" />
          )}
          {user.shear && (
            <Chip sx={{ fontSize: '13px', width: '105px', backgroundColor: 'gray', color: 'white', fontWeight: 'bold' }} label="Shear" />
          )}
          {user.maintenance && (
            <Chip sx={{ fontSize: '13px', width: '105px', backgroundColor: 'gray', color: 'white', fontWeight: 'bold' }} label="Maintenance" />
          )}
          {user.shipping && (
            <Chip sx={{ fontSize: '13px', width: '105px', backgroundColor: 'gray', color: 'white', fontWeight: 'bold' }} label="Shipping" />
          )}
          {user.purchasing && (
            <Chip sx={{ fontSize: '13px', width: '105px', backgroundColor: 'gray', color: 'white', fontWeight: 'bold' }} label="Purchasing" />
          )}
          {user.backlog && (
            <Chip sx={{ fontSize: '13px', width: '105px', backgroundColor: 'gray', color: 'white', fontWeight: 'bold' }} label="Backlog" />
          )}
          {user.specialty && (
            <Chip sx={{ fontSize: '13px', width: '105px', backgroundColor: 'gray', color: 'white', fontWeight: 'bold' }} label="Specialty" />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default EmployeeCard;