import { Link } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';

import bdIcon from '../../images/bdIcon.png';
import engineeringIcon from '../../images/engineeringIcon.png';
import flaserIcon from '../../images/flaserIcon.png';
import formingIcon from '../../images/formingIcon.png';
import hardwareIcon from '../../images/hardwareIcon.png';
import laserIcon from '../../images/laserIcon.png';
import machineIcon from '../../images/machineIcon.png';
import punchIcon from '../../images/punchIcon.png';
import qualityIcon from '../../images/qualityIcon.png';
import qcInfoIcon from '../../images/qcInfoIcon.png';
import sawIcon from '../../images/sawIcon.png';
import shearIcon from '../../images/shearIcon.png';
import slaserIcon from '../../images/slaserIcon.png';
import tapIcon from '../../images/tapIcon.png';
import tlaserIcon from '../../images/tlaserIcon.png';

export const DepartmentCard = ({ area }) => {
  let backgroundColor;
  switch (area.areaType) {
    case 'production':
      backgroundColor = 'lightgreen';
      break;
    case 'programming':
      backgroundColor = '#F75D59';
      break;
    case 'tooling':
      backgroundColor = '#CDE3FD';
      break;
    case 'misc':
      backgroundColor = 'yellow';
      break;
    default:
      backgroundColor = 'white';
      break;
  }

  const imageMap = {
    bd: bdIcon,
    engineering: engineeringIcon,
    flaser: flaserIcon,
    forming: formingIcon,
    hardware: hardwareIcon,
    laser: laserIcon,
    machining: machineIcon,
    punch: punchIcon,
    quality: qualityIcon,
    qcInfo: qcInfoIcon,
    saw: sawIcon,
    shear: shearIcon,
    slaser: slaserIcon,
    tap: tapIcon,
    tlaser: tlaserIcon,
  };

  const imageSrc = imageMap[area.image];

  return (
    <Link to={area.link} style={{ textDecoration: 'none' }}>
      <Card
        sx={{
          width: '250px',
          margin: '10px',
          padding: '10px',
          backgroundColor,
          boxShadow: 3,
          '&:hover': { boxShadow: 6 }
        }}
      >
        {imageSrc && (
          <CardMedia
            component="img"
            image={imageSrc}
            alt={`${area.area} icon`}
            sx={{ height: '150px', objectFit: 'contain' }}
          />
        )}
        <CardContent>
          <Typography variant="h6" align="center" fontWeight="bold">
            {area.area}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
};