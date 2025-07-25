import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Chip, IconButton, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';

import { useUserContext } from '../../context/UserContext';
import { NavLink } from 'react-router-dom';

import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import { Bar, Doughnut } from 'react-chartjs-2';
import { ArcElement, BarElement, CategoryScale, Chart, Legend, LinearScale, Title, Tooltip } from 'chart.js';

import MonarchButton from '../../components/shared/MonarchButton';
import PageContainer from '../../components/shared/PageContainer';
import SiteStatusChecker from '../../components/home/SiteStatusChecker';

import getAllJobs from '../../services/engineering/getAllJobs';
import getAllRequests from '../../services/maintenance/getAllRequests';
import getFutureJobs from '../../services/engineering/getFutureJobs';
import getOutsourceJobs from '../../services/engineering/getOutsourceJobs';
import getRepeatJobs from '../../services/engineering/getRepeatJobs';
import getTBRJobs from '../../services/engineering/getTBRJobs';
import getUnconfirmedJobs from '../../services/engineering/getUnconfirmedJobs';
import getUserTasks from '../../services/tasks/getUserTasks';


export const Dashboard = () => {
  Chart.register(
    ArcElement,
    BarElement,
    CategoryScale,
    Legend,
    LinearScale,
    Title,
    Tooltip,
  );

  const navigate = useNavigate();
  const { cookieData } = useUserContext();
  const [engTotal, setEngTotal] = useState(0);
  const [expedite, setExpedite] = useState(0);
  const [engTbr, setEngTbr] = useState(0);
  const [engFuture, setEngFuture] = useState(0);
  const [engRepeat, setEngRepeat] = useState(0);
  const [engOutsource, setEngOutsource] = useState(0);
  const [formTbr, setFormTbr] = useState(0);
  const [formFuture, setFormFuture] = useState(0);
  const [tlTbr, setTLTbr] = useState(0);
  const [tlFuture, setTLFuture] = useState(0);
  const [testBD, setTestBD] = useState(0);
  const [qcTbr, setQCTbr] = useState(0);
  const [qcFuture, setQCFuture] = useState(0);
  const [proto, setProto] = useState(0);
  const [unconfirmedJobs, setUnconfirmedJobs] = useState(0);
  const [unconfirmedTotal, setUnconfirmedTotal] = useState(0);
  const [userTasksActive, setUserTasksActive] = useState(0);
  const [userTasksHold, setUserTasksHold] = useState(0);
  const [maintActive, setMaintActive] = useState(0);
  const [maintHold, setMaintHold] = useState(0);
  const [maintRequest, setMaintRequest] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [engRes, tbrRes, futureRes, repeatRes, outsourceRes, unconfirmedRes, userTaskRes, maintenanceRes] = await Promise.all([
        getAllJobs(),
        getTBRJobs(),
        getFutureJobs(),
        getRepeatJobs(),
        getOutsourceJobs(),
        getUnconfirmedJobs(),
        getUserTasks(cookieData.id),
        getAllRequests(),
      ]);

      console.log(futureRes)

      const getField = (row, key) => {
        return row?.dataValues?.[key] ?? row?.[key];
      };

      setEngTotal(engRes.filter(row => typeof row.JobNo !== 'undefined').length);
      setExpedite(engRes.filter(row => typeof row.JobNo !== 'undefined' && row.WorkCode == 'HOT').length);
      setEngTbr(tbrRes.filter(row => typeof row.JobNo !== 'undefined').length);
      setEngFuture(futureRes.filter(row => typeof row.JobNo !== 'undefined' && row.User_Text3 !== 'REPEAT').length);
      setEngRepeat(repeatRes.length);
      setEngOutsource(outsourceRes.length);
      setUserTasksActive(userTaskRes.data.filter((task) => task.status === 'Active' || task.status === 'Process').length);
      setUserTasksHold(userTaskRes.data.filter((task) => task.status === 'Hold').length);

      setFormTbr(
        tbrRes.filter(row =>
          typeof row.JobNo !== 'undefined' && getField(row, 'jobStatus') === 'FORMING'
        ).length
      );

      setFormFuture(
        futureRes.filter(row =>
          typeof row.JobNo !== 'undefined' && getField(row, 'jobStatus') === 'FORMING'
        ).length
      );

      setTestBD(
        engRes.filter(row =>
          typeof row.JobNo !== 'undefined' && getField(row, 'formStatus') === 'BD TEST'
        ).length
      );

      setTLTbr(
        tbrRes.filter(row =>
          typeof row.JobNo !== 'undefined' && getField(row, 'jobStatus') === 'TLASER'
        ).length
      );

      setTLFuture(
        futureRes.filter(row =>
          typeof row.JobNo !== 'undefined' && getField(row, 'jobStatus') === 'TLASER'
        ).length
      );

      setQCTbr(
        tbrRes.filter(row => {
          const status = getField(row, 'jobStatus');
          return typeof row.JobNo !== 'undefined' && (status === 'QC' || status === 'CHECKING');
        }).length
      );

      setQCFuture(
        futureRes.filter(row => {
          const status = getField(row, 'jobStatus');
          return typeof row.JobNo !== 'undefined' && (status === 'QC' || status === 'CHECKING');
        }).length
      );

      setProto(
        engRes.filter(row =>
          typeof row.JobNo !== 'undefined' && getField(row, 'jobStatus') === 'PROTO'
        ).length
      );

      setUnconfirmedJobs(unconfirmedRes);
      setUnconfirmedTotal(unconfirmedRes.length);

      setMaintActive(maintenanceRes.data.filter(row => !row.done && !row.hold && row.approvedBy).length);
      setMaintRequest(maintenanceRes.data.filter(row => !row.done && !row.hold && !row.approvedBy).length);
      setMaintHold(maintenanceRes.data.filter(row => !row.done && row.hold).length);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setInterval(() => {
      fetchData();
    }, 30000)
  }, [])

  let productionColor = 'lightgreen';
  let programmingColor = '#F75D59';
  let defaultColor = 'gray';
  let specialtyColor = 'yellow';
  let inventoryColor = '#b069db';

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
      },
    },
  };

  const labels = ['Engineering', 'Forming', 'TLaser', 'QC'];

  const data = {
    labels,
    datasets: [
      {
        label: 'TBR',
        data: [(engTbr - formTbr - tlTbr - qcTbr), formTbr, tlTbr, qcTbr],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Future',
        data: [(engFuture - formFuture - tlFuture - qcFuture), formFuture, tlFuture, qcFuture],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'center',
        labels: {
          boxWidth: 20,
          padding: 20,
          fullSize: true,
        }
      },
    },
    layout: {
      padding: {
        top: 0,
        bottom: 0,
      }
    },
  };

  const donutData = {
    labels: ['Eng', 'Form', 'TL', 'QC'],
    datasets: [
      {
        label: 'Jobs',
        data: [
          ((engTbr - formTbr - tlTbr - qcTbr) + (engFuture - formFuture - tlFuture - qcFuture)),
          (formTbr + formFuture),
          (tlTbr + tlFuture),
          (qcTbr + qcFuture)
        ],
        backgroundColor: [
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(153, 102, 255, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      }
    ]
  }

  return (
    <PageContainer loading={loading} title='Monarch Metal'>
      {cookieData.name ? (
        <Box sx={{ width: '100%', p: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
            <Box sx={{ flexGrow: 1, flexShrink: 1, minWidth: '300px', maxWidth: { xs: '100%', md: '30%' }, display: 'flex', flexDirection: 'column', gap: 2 }}>

              {/* USER INFORMATION */}
              <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid grey', borderRadius: '15px', p: 2, backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                <IconButton onClick={() => { navigate('/profile') }}>
                  <PersonIcon sx={{ fontSize: 55 }} />
                </IconButton>
                <Box sx={{ ml: 2 }}>
                  {/* <Typography sx={{ fontSize: 28, fontWeight: 'bold' }}>{cookieData.name}</Typography> */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {cookieData.engineering && (
                      <Chip
                        sx={{ fontSize: '12px', width: '100px', height: '25px', backgroundColor: programmingColor, color: 'white', fontWeight: 'bold' }}
                        label='Engineering'
                        onClick={() => navigate('/engineering')}
                      />
                    )}
                    {cookieData.machining && (
                      <Chip
                        sx={{ fontSize: '12px', width: '100px', height: '25px', backgroundColor: programmingColor, color: 'white', fontWeight: 'bold' }}
                        label='Machining'
                        onClick={() => navigate('/machining')}
                      />
                    )}
                    {cookieData.quality && (
                      <Chip
                        sx={{ fontSize: '12px', width: '100px', height: '25px', backgroundColor: programmingColor, color: 'white', fontWeight: 'bold' }}
                        label='Quality'
                        onClick={() => navigate('/quality')}
                      />
                    )}
                    {cookieData.laser && (
                      <>
                        <Chip
                          sx={{ fontSize: '12px', width: '100px', height: '25px', backgroundColor: productionColor, color: 'black', fontWeight: 'bold' }}
                          label='Laser'
                          onClick={() => navigate('/laser')}
                        />
                        <Chip
                          sx={{ fontSize: '12px', width: '100px', height: '25px', backgroundColor: productionColor, color: 'black', fontWeight: 'bold' }}
                          label='FLaser'
                          onClick={() => navigate('/fixtureLaser')}
                        />
                        <Chip
                          sx={{ fontSize: '12px', width: '100px', height: '25px', backgroundColor: productionColor, color: 'black', fontWeight: 'bold' }}
                          label='SLaser'
                          onClick={() => navigate('/staticLaser')}
                        />
                      </>
                    )}
                    {cookieData.forming && (
                      <>
                        <Chip
                          sx={{ fontSize: '12px', width: '100px', height: '25px', backgroundColor: programmingColor, color: 'white', fontWeight: 'bold' }}
                          label='Forming'
                          onClick={() => navigate('/formingprog')}
                        />
                        <Chip
                          sx={{ fontSize: '12px', width: '100px', height: '25px', backgroundColor: productionColor, color: 'black', fontWeight: 'bold' }}
                          label='Forming'
                          onClick={() => navigate('/forming')}
                        />
                      </>
                    )}
                    {cookieData.tlaser && (
                      <>
                        <Chip
                          sx={{ fontSize: '12px', width: '100px', height: '25px', backgroundColor: programmingColor, color: 'white', fontWeight: 'bold' }}
                          label='TLaser'
                          onClick={() => navigate('/tubeLaserProg')}
                        />
                        <Chip
                          sx={{ fontSize: '12px', width: '100px', height: '25px', backgroundColor: productionColor, color: 'black', fontWeight: 'bold' }}
                          label='TLaser'
                          onClick={() => navigate('/tubeLaser')}
                        />
                      </>
                    )}
                    {cookieData.saw && (
                      <Chip
                        sx={{ fontSize: '12px', width: '100px', height: '25px', backgroundColor: productionColor, color: 'black', fontWeight: 'bold' }}
                        label='Saw'
                        onClick={() => navigate('/saw')}
                      />
                    )}
                    {cookieData.shear && (
                      <Chip
                        sx={{ fontSize: '12px', width: '100px', height: '25px', backgroundColor: productionColor, color: 'black', fontWeight: 'bold' }}
                        label='Shear'
                        onClick={() => navigate('/shear')}
                      />
                    )}
                    {cookieData.punch && (
                      <Chip
                        sx={{ fontSize: '12px', width: '100px', height: '25px', backgroundColor: productionColor, color: 'black', fontWeight: 'bold' }}
                        label='Punch'
                        onClick={() => navigate('/punch')}
                      />
                    )}
                    {cookieData.maintenance && (
                      <Chip
                        sx={{ fontSize: '12px', width: '100px', height: '25px', backgroundColor: defaultColor, color: 'white', fontWeight: 'bold' }}
                        label='Maintenance'
                        onClick={() => navigate('/maintenance')}
                      />
                    )}
                    {cookieData.shipping && (
                      <Chip
                        sx={{ fontSize: '12px', width: '100px', height: '25px', backgroundColor: defaultColor, color: 'white', fontWeight: 'bold' }}
                        label='Shipping'
                        onClick={() => navigate('/shipping')}
                      />
                    )}
                    {cookieData.purchasing && (
                      <Chip
                        sx={{ fontSize: '12px', width: '100px', height: '25px', backgroundColor: inventoryColor, color: 'white', fontWeight: 'bold' }}
                        label='Purchasing'
                        onClick={() => navigate('/purchasing')}
                      />
                    )}
                    {cookieData.backlog && (
                      <Chip
                        sx={{ fontSize: '12px', width: '100px', height: '25px', backgroundColor: defaultColor, color: 'white', fontWeight: 'bold' }}
                        label='Backlog'
                        onClick={() => navigate('/backlog')}
                      />
                    )}
                    {cookieData.specialty && (
                      <>
                        <Chip
                          sx={{ fontSize: '12px', width: '100px', height: '25px', backgroundColor: specialtyColor, color: 'black', fontWeight: 'bold' }}
                          label='Efficiency'
                          onClick={() => navigate('/efficiency')}
                        />
                        <Chip
                          sx={{ fontSize: '12px', width: '100px', height: '25px', backgroundColor: specialtyColor, color: 'black', fontWeight: 'bold' }}
                          label='Sheet Inv'
                          onClick={() => navigate('/sheetInventory')}
                        />
                        <Chip
                          sx={{ fontSize: '12px', width: '100px', height: '25px', backgroundColor: specialtyColor, color: 'black', fontWeight: 'bold' }}
                          label='VTiger'
                          onClick={() => navigate('/vtiger')}
                        />
                      </>
                    )}
                  </Box>
                </Box>
              </Box>

              {/* JOB SUMMARY */}
              <Box sx={{ border: '1px solid grey', borderRadius: '15px', p: 2, backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                <Table sx={{ borderCollapse: 'collapse' }}>
                  <TableBody>
                    <TableRow>
                      <TableCell align='right' sx={{ fontWeight: 'bold', fontSize: '22px', py: 0, pr: 2, border: 'none', width: '50%' }}>Total</TableCell>
                      <TableCell align='left' sx={{ fontWeight: 'bold', fontSize: '22px', py: 0, border: 'none' }}>{engTotal}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, width: '95%' }}>
                  <Box>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell align='right' sx={{ fontWeight: 'bold', fontSize: '16px', py: 0, pr: 2, border: 'none' }}>TBR</TableCell>
                          <TableCell align='left' sx={{ fontWeight: 'bold', fontSize: '16px', py: 0, border: 'none' }}>{engTbr}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align='right' sx={{ fontWeight: 'bold', fontSize: '16px', py: 0, pr: 2, border: 'none' }}>Future</TableCell>
                          <TableCell align='left' sx={{ fontWeight: 'bold', fontSize: '16px', py: 0, border: 'none' }}>{engFuture}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align='right' sx={{ fontWeight: 'bold', fontSize: '16px', py: 0, pr: 2, border: 'none' }}>Expedite</TableCell>
                          <TableCell align='left' sx={{ fontWeight: 'bold', fontSize: '16px', py: 0, border: 'none' }}>{expedite}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align='right' sx={{ fontWeight: 'bold', fontSize: '16px', py: 0, pr: 2, border: 'none' }}>Repeats</TableCell>
                          <TableCell align='left' sx={{ fontWeight: 'bold', fontSize: '16px', py: 0, border: 'none' }}>{engRepeat}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Box>
                  <Box>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell align='right' sx={{ fontWeight: 'bold', fontSize: '16px', py: 0, pr: 2, border: 'none' }}>Outsource</TableCell>
                          <TableCell align='left' sx={{ fontWeight: 'bold', fontSize: '16px', py: 0, border: 'none' }}>{engOutsource}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align='right' sx={{ fontWeight: 'bold', fontSize: '16px', py: 0, pr: 2, border: 'none' }}>BD Test</TableCell>
                          <TableCell align='left' sx={{ fontWeight: 'bold', fontSize: '16px', py: 0, border: 'none' }}>{testBD}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align='right' sx={{ fontWeight: 'bold', fontSize: '16px', py: 0, pr: 2, border: 'none' }}>Prototype</TableCell>
                          <TableCell align='left' sx={{ fontWeight: 'bold', fontSize: '16px', py: 0, border: 'none' }}>{proto}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align='right' sx={{ fontWeight: 'bold', fontSize: '16px', py: 0, pr: 2, border: 'none' }}>
                            <a href='http://10.0.1.57:3001/backlog/unconfirmed' target='_blank' rel='noopener noreferrer' style={{ fontWeight: 'bold', fontSize: '16px', textDecoration: 'none', color: 'inherit' }}>
                              Unconfirmed
                            </a>
                          </TableCell>
                          <TableCell align='left' sx={{ fontWeight: 'bold', fontSize: '16px', py: 0, border: 'none' }}>{unconfirmedTotal}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Box>
                </Box>
              </Box>

              {/* TASKS */}
              {(userTasksActive > 0 || userTasksHold > 0) && (
                <Box
                  sx={{
                    border: '1px solid grey', borderRadius: '15px', p: 2, cursor: 'pointer', backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.15)',
                    },
                  }}
                  onClick={() => navigate('/tasks')}
                >
                  <Table sx={{ borderCollapse: 'collapse' }}>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '20px', py: 0, border: 'none' }}>Tasks</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', py: 0, border: 'none' }}>Active: {userTasksActive}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', py: 0, border: 'none' }}>On Hold: {userTasksHold}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              )}

              {/* MAINTENANCE */}
              {cookieData.maintenance && (
                <Box
                  sx={{
                    border: '1px solid grey', borderRadius: '15px', p: 2, cursor: 'pointer', backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.15)',
                    },
                  }}
                  onClick={() => navigate('/maintenance')}
                >
                  <Table sx={{ borderCollapse: 'collapse' }}>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '20px', py: 0, border: 'none' }}>Maint</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', py: 0, border: 'none' }}>Active: {maintActive}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', py: 0, border: 'none' }}>Hold: {maintHold}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', py: 0, border: 'none' }}>Request: {maintRequest}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              )}

              {/* DOUGHNUT CHART */}
              <Box sx={{ border: '1px solid grey', borderRadius: '15px', pb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '250px', backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                <Doughnut data={donutData} options={donutOptions} style={{ width: '100%', maxWidth: '400px' }} />
              </Box>
            </Box>

            <Box sx={{ flexGrow: 1, flexShrink: 1, minWidth: '400px', display: 'flex', flexDirection: 'column', gap: 2 }}>

              {/* BAR CHART */}
              <Box sx={{ border: '1px solid grey', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', pb: 3, backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                <Bar data={data} options={options} style={{ width: '100%', height: '100%' }} />
              </Box>

              {/* SITE STATUS CHECKER */}
              <Box sx={{ border: '1px solid grey', borderRadius: '15px', backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                <SiteStatusChecker />
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3 }}>
            <Typography sx={{ fontSize: '16px' }}>This Page Auto-Refreshes Every 30 Seconds</Typography>
          </Box>

          <IconButton onClick={fetchData} sx={{ backgroundColor: '#111827', color: 'white', height: '52.5px', width: '52.5px', zIndex: 1000, position: 'fixed', bottom: '20px', right: '20px', '&:hover': { backgroundColor: '#374151' } }}>
            <RefreshIcon fontSize='large' />
          </IconButton>
        </Box>
      ) : (
        <NavLink to='/login' style={{ textDecoration: 'none' }}>
          <Box sx={{ textAlign: 'center' }}>
            <MonarchButton>
              Log In
            </MonarchButton>
          </Box>
        </NavLink>
      )}
    </PageContainer>
  );
}