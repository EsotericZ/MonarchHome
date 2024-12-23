import { useEffect, useState, Fragment } from 'react';
import { Alert, Box, Divider, FormControl, IconButton, MenuItem, Paper, Select, Snackbar, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from '@mui/material';

import { useUserContext } from '../../context/UserContext';

import PageContainer from '../../components/shared/PageContainer';
import CustomTabs from '../../components/shared/CustomTabs';
import CustomHeader from '../../components/programming/CustomHeader';
import DataTableCell from '../../components/shared/DataTableCell';

import PuffLoader from 'react-spinners/PuffLoader';
import AddIcon from '@mui/icons-material/Add';
import { Bar, Doughnut } from 'react-chartjs-2';
import { ArcElement, BarElement, CategoryScale, Chart, Legend, LinearScale, Title, Tooltip } from 'chart.js';

import getAllJobs from '../../services/backlog/getAllJobs';
import getNextMonthJobs from '../../services/backlog/getNextMonthJobs';
import getFutureJobs from '../../services/backlog/getFutureJobs';
import getAllSubJobs from '../../services/backlog/getAllSubJobs';
import getSingleJob from '../../services/backlog/getSingleJob';
import updateJob from '../../services/backlog/updateJob';
import updateEmail from '../../services/backlog/updateEmail';
import updateHold from '../../services/backlog/updateHold';

export const Backlog = () => {
  const { cookieData } = useUserContext();

  Chart.register(
    ArcElement,
    BarElement,
    CategoryScale,
    Legend,
    LinearScale,
    Title,
    Tooltip,
  );

  let rowIndex = 1;

  const [searchedValueOrderNo, setSearchedValueOrderNo] = useState('');
  const [searchedValueJobNo, setSearchedValueJobNo] = useState('');
  const [searchedValueCustomer, setSearchedValueCustomer] = useState('');
  const [searchedValueArea, setSearchedValueArea] = useState('');
  const [searchedValueOSV, setSearchedValueOSV] = useState('');

  const [jobNo, setJobNo] = useState('');
  const [jobType, setJobType] = useState('');
  const [partNo, setPartNo] = useState('');
  const [partRev, setPartRev] = useState('');
  const [custCode, setCustCode] = useState('');
  const [routing, setRouting] = useState([]);
  const [id, setId] = useState('');
  const [blNotes, setBlNotes] = useState('');
  const [osvNotes, setOsvNotes] = useState('');
  const [cdate, setCdate] = useState('');
  const [email, setEmail] = useState(0);
  const [hold, setHold] = useState(0);
  const [update, setUpdate] = useState('');

  const [jobs, setJobs] = useState([]);
  const [nextMonthJobs, setNextMonthJobs] = useState([]);
  const [allFutureJobs, setAllFutueJobs] = useState([]);
  const [subJobs, setSubJobs] = useState([]);
  const [futureJobs, setFutureJobs] = useState([]);
  const [pastJobs, setPastJobs] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [showRoute, setShowRoute] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  const [current, setCurrent] = useState('C');
  const [nextMonth, setNextMonth] = useState('N');
  const [futureMonths, setFutureMonths] = useState('F');
  const [overview, setOverview] = useState('Overview');

  const [lateJobs, setLateJobs] = useState(0);
  const [upcomingJobs, setUpcomingJobs] = useState(0);
  const [monthJobs, setMonthJobs] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);

  const [lateEng, setLateEng] = useState(0);
  const [lateShear, setLateShear] = useState(0);
  const [latePunch, setLatePunch] = useState(0);
  const [lateLaser, setLateLaser] = useState(0);
  const [lateBrake, setLateBrake] = useState(0);
  const [lateHard, setLateHard] = useState(0);
  const [lateTLaser, setLateTLaser] = useState(0);
  const [lateSaw, setLateSaw] = useState(0);
  const [lateWeld, setLateWeld] = useState(0);
  const [lateAssy, setLateAssy] = useState(0);
  const [latePowder, setLatePowder] = useState(0);
  const [lateOSV, setLateOSV] = useState(0);
  const [lateSum, setLateSum] = useState(0);
  const [futureEng, setFutureEng] = useState(0);
  const [futureShear, setFutureShear] = useState(0);
  const [futurePunch, setFuturePunch] = useState(0);
  const [futureLaser, setFutureLaser] = useState(0);
  const [futureBrake, setFutureBrake] = useState(0);
  const [futureHard, setFutureHard] = useState(0);
  const [futureTLaser, setFutureTLaser] = useState(0);
  const [futureSaw, setFutureSaw] = useState(0);
  const [futureWeld, setFutureWeld] = useState(0);
  const [futureAssy, setFutureAssy] = useState(0);
  const [futurePowder, setFuturePowder] = useState(0);
  const [futureOSV, setFutureOSV] = useState(0);
  const [futureSum, setFutureSum] = useState(0);

  const [thisWeekSum, setThisWeekSum] = useState(0);
  const [secondWeekSum, setSecondWeekSum] = useState(0);
  const [thirdWeekSum, setThirdWeekSum] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0);

  const formatDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    const [year, month, day] = dateStr.split('-');
    return new Date(year, month - 1, day.split('T')[0]);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allJobs, nextJobs, moreJobs] = await Promise.all([
        getAllJobs(),
        getNextMonthJobs(),
        getFutureJobs(),
      ]);
      let masters = allJobs.filter(row => row.MasterJobNo != null);
      let masterJobs = []
      masters.forEach((e) => {
        masterJobs.push(e.MasterJobNo)
      })
      let nonEmptyJobs = masterJobs.filter(row => row != '')

      allJobs.forEach((e) => {
        if (nonEmptyJobs.includes(e.JobNo)) {
          e.HasSubs = 1
        } else {
          e.HasSubs = 0
        }
      })

      nextJobs.forEach((e) => {
        if (nonEmptyJobs.includes(e.JobNo)) {
          e.HasSubs = 1
        } else {
          e.HasSubs = 0
        }
      })
      setNextMonthJobs(nextJobs);

      moreJobs.forEach((e) => {
        if (nonEmptyJobs.includes(e.JobNo)) {
          e.HasSubs = 1
        } else {
          e.HasSubs = 0
        }
      })
      setAllFutueJobs(moreJobs);

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const sortedJobs = allJobs.sort((a, b) => formatDate(a.DueDate) - formatDate(b.DueDate));
      const pastJobs = sortedJobs.filter(job => formatDate(job.DueDate) < yesterday);
      const futureJobs = sortedJobs.filter(job => formatDate(job.DueDate) >= yesterday);
      const pastJobsNo = pastJobs.filter(job => !job.MasterJobNo);
      const sortedJobsNo = sortedJobs.filter(job => !job.MasterJobNo);

      const thisMonthNo = today.getMonth();
      const nextMonthNo = (today.getMonth() + 1) % 12;
      const futureMonthNo = (today.getMonth() + 2) % 12;
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      const dayOfWeek = today.getDay();
      const sunday = new Date(today);
      const saturday = new Date(today);
      sunday.setDate(today.getDate() - dayOfWeek);
      saturday.setDate(today.getDate() - dayOfWeek + 6);
      const secondSunday = new Date(today);
      const secondSaturday = new Date(today);
      secondSunday.setDate(today.getDate() - dayOfWeek + 7);
      secondSaturday.setDate(today.getDate() - dayOfWeek + 13);
      const thirdSunday = new Date(today);
      const thirdSaturday = new Date(today);
      thirdSunday.setDate(today.getDate() - dayOfWeek + 14);
      thirdSaturday.setDate(today.getDate() - dayOfWeek + 20);

      let thisWeekProjected = 0;
      let secondWeekProjected = 0;
      let thirdWeekProjected = 0;

      allJobs.forEach(job => {
        const jobDate = job.dataValues?.cdate ? new Date(job.dataValues.cdate) : null;

        if (!jobDate) {
          return;
        }
        const value = (job.QtyOrdered - job.QtyShipped2Cust) * job.UnitPrice;

        if (jobDate >= sunday && jobDate <= saturday) {
          thisWeekProjected += value;
        } else if (jobDate >= secondSunday && jobDate <= secondSaturday) {
          secondWeekProjected += value;
        } else if (jobDate >= thirdSunday && jobDate <= thirdSaturday) {
          thirdWeekProjected += value;
        }
      });

      setThisWeekSum(thisWeekProjected);
      setSecondWeekSum(secondWeekProjected);
      setThirdWeekSum(thirdWeekProjected);

      setLateJobs(pastJobsNo.length);
      setUpcomingJobs(sortedJobsNo.length - pastJobsNo.length);
      setMonthJobs(sortedJobsNo.length);

      setLateEng((pastJobsNo.filter(row => row.WorkCntr == '101 ENGIN' && row.User_Text2 != '4. DONE')).length)
      setLateShear((pastJobsNo.filter(row => row.WorkCntr == '201 SHEAR')).length)
      setLatePunch((pastJobsNo.filter(row => row.WorkCntr == '202 PUNCH')).length)
      setLateLaser((pastJobsNo.filter(row => row.WorkCntr == '203 LASER')).length)
      setLateBrake((pastJobsNo.filter(row => row.WorkCntr == '204 BRAKE')).length)
      setLateHard((pastJobsNo.filter(row => row.WorkCntr == '206 HARD')).length)
      setLateTLaser((pastJobsNo.filter(row => row.WorkCntr == '211 TLASER')).length)
      setLateSaw((pastJobsNo.filter(row => row.WorkCntr == '301 SAW')).length)
      setLateWeld((pastJobsNo.filter(row => row.WorkCntr == '402 WELD')).length)
      setLateAssy((pastJobsNo.filter(row => row.WorkCntr == '702 ASSEM')).length)
      setLatePowder((pastJobsNo.filter(row => row.WorkCntr == '601 POWDER')).length)
      setLateOSV(((pastJobsNo.filter(row => row.User_Text2 == '6. OUTSOURCE')).length));

      const totalLateSum = pastJobsNo.reduce((sum, job) => {
        const value = (job.QtyOrdered - job.QtyShipped2Cust) * job.UnitPrice;
        return sum + value;
      }, 0);
      setLateSum(totalLateSum);

      setFutureEng((sortedJobsNo.filter(row => row.WorkCntr == '101 ENGIN' && row.User_Text2 != '4. DONE')).length - (pastJobsNo.filter(row => row.WorkCntr == '101 ENGIN' && row.User_Text2 != '4. DONE')).length)
      setFutureShear((sortedJobsNo.filter(row => row.WorkCntr == '201 SHEAR')).length - (pastJobsNo.filter(row => row.WorkCntr == '201 SHEAR')).length)
      setFuturePunch((sortedJobsNo.filter(row => row.WorkCntr == '202 PUNCH')).length - (pastJobsNo.filter(row => row.WorkCntr == '202 PUNCH')).length)
      setFutureLaser((sortedJobsNo.filter(row => row.WorkCntr == '203 LASER')).length - (pastJobsNo.filter(row => row.WorkCntr == '203 LASER')).length)
      setFutureBrake((sortedJobsNo.filter(row => row.WorkCntr == '204 BRAKE')).length - (pastJobsNo.filter(row => row.WorkCntr == '204 BRAKE')).length)
      setFutureHard((sortedJobsNo.filter(row => row.WorkCntr == '206 HARD')).length - (pastJobsNo.filter(row => row.WorkCntr == '206 HARD')).length)
      setFutureTLaser((sortedJobsNo.filter(row => row.WorkCntr == '211 TLASER')).length - (pastJobsNo.filter(row => row.WorkCntr == '211 TLASER')).length)
      setFutureSaw((sortedJobsNo.filter(row => row.WorkCntr == '301 SAW')).length - (pastJobsNo.filter(row => row.WorkCntr == '301 SAW')).length)
      setFutureWeld((sortedJobsNo.filter(row => row.WorkCntr == '402 WELD')).length - (pastJobsNo.filter(row => row.WorkCntr == '402 WELD')).length)
      setFutureAssy((sortedJobsNo.filter(row => row.WorkCntr == '702 ASSEM')).length - (pastJobsNo.filter(row => row.WorkCntr == '702 ASSEM')).length)
      setFuturePowder((sortedJobsNo.filter(row => row.WorkCntr == '601 POWDER')).length - (pastJobsNo.filter(row => row.WorkCntr == '601 POWDER')).length)
      setFutureOSV((sortedJobsNo.filter(row => row.User_Text2 == '6. OUTSOURCE')).length - (pastJobsNo.filter(row => row.User_Text2 == '6. OUTSOURCE')).length);

      const totalFutureSum = sortedJobsNo.reduce((sum, job) => {
        const value = (job.QtyOrdered - job.QtyShipped2Cust) * job.UnitPrice;
        return sum + value;
      }, 0);
      setFutureSum(totalFutureSum - totalLateSum);

      setCurrent(months[thisMonthNo]);
      setNextMonth(months[nextMonthNo]);
      setFutureMonths(`${months[futureMonthNo]} +`);
      setOverview(`Overview (${months[thisMonthNo]})`);
      setPastJobs(pastJobs);
      setFutureJobs(futureJobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateData = async () => {
    try {
      const [allJobs, nextJobs, moreJobs] = await Promise.all([
        getAllJobs(),
        getNextMonthJobs(),
        getFutureJobs(),
      ]);
      let masters = allJobs.filter(row => row.MasterJobNo != null);
      let masterJobs = []
      masters.forEach((e) => {
        masterJobs.push(e.MasterJobNo)
      })
      let nonEmptyJobs = masterJobs.filter(row => row != '')

      allJobs.forEach((e) => {
        if (nonEmptyJobs.includes(e.JobNo)) {
          e.HasSubs = 1
        } else {
          e.HasSubs = 0
        }
      })

      nextJobs.forEach((e) => {
        if (nonEmptyJobs.includes(e.JobNo)) {
          e.HasSubs = 1
        } else {
          e.HasSubs = 0
        }
      })
      setNextMonthJobs(nextJobs);

      moreJobs.forEach((e) => {
        if (nonEmptyJobs.includes(e.JobNo)) {
          e.HasSubs = 1
        } else {
          e.HasSubs = 0
        }
      })
      setAllFutueJobs(moreJobs);

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const sortedJobs = allJobs.sort((a, b) => formatDate(a.DueDate) - formatDate(b.DueDate));
      const pastJobs = sortedJobs.filter(job => formatDate(job.DueDate) < yesterday);
      const futureJobs = sortedJobs.filter(job => formatDate(job.DueDate) >= yesterday);
      const pastJobsNo = pastJobs.filter(job => !job.MasterJobNo);
      const sortedJobsNo = sortedJobs.filter(job => !job.MasterJobNo);

      const thisMonthNo = today.getMonth();
      const nextMonthNo = (today.getMonth() + 1) % 12;
      const futureMonthNo = (today.getMonth() + 2) % 12;
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      const dayOfWeek = today.getDay();
      const sunday = new Date(today);
      const saturday = new Date(today);
      sunday.setDate(today.getDate() - dayOfWeek);
      saturday.setDate(today.getDate() - dayOfWeek + 6);
      const secondSunday = new Date(today);
      const secondSaturday = new Date(today);
      secondSunday.setDate(today.getDate() - dayOfWeek + 7);
      secondSaturday.setDate(today.getDate() - dayOfWeek + 13);
      const thirdSunday = new Date(today);
      const thirdSaturday = new Date(today);
      thirdSunday.setDate(today.getDate() - dayOfWeek + 14);
      thirdSaturday.setDate(today.getDate() - dayOfWeek + 20);

      let thisWeekProjected = 0;
      let secondWeekProjected = 0;
      let thirdWeekProjected = 0;

      allJobs.forEach(job => {
        const jobDate = new Date(job.dataValues.cdate);
        const value = (job.QtyOrdered - job.QtyShipped2Cust) * job.UnitPrice;

        if (jobDate >= sunday && jobDate <= saturday) {
          thisWeekProjected += value;
        } else if (jobDate >= secondSunday && jobDate <= secondSaturday) {
          secondWeekProjected += value;
        } else if (jobDate >= thirdSunday && jobDate <= thirdSaturday) {
          thirdWeekProjected += value;
        }
      });

      setThisWeekSum(thisWeekProjected);
      setSecondWeekSum(secondWeekProjected);
      setThirdWeekSum(thirdWeekProjected);

      setLateJobs(pastJobsNo.length);
      setUpcomingJobs(sortedJobsNo.length - pastJobsNo.length);
      setMonthJobs(sortedJobsNo.length);

      setLateEng((pastJobsNo.filter(row => row.WorkCntr == '101 ENGIN')).length)
      setLateShear((pastJobsNo.filter(row => row.WorkCntr == '201 SHEAR')).length)
      setLatePunch((pastJobsNo.filter(row => row.WorkCntr == '202 PUNCH')).length)
      setLateLaser((pastJobsNo.filter(row => row.WorkCntr == '203 LASER')).length)
      setLateBrake((pastJobsNo.filter(row => row.WorkCntr == '204 BRAKE')).length)
      setLateHard((pastJobsNo.filter(row => row.WorkCntr == '206 HARD')).length)
      setLateTLaser((pastJobsNo.filter(row => row.WorkCntr == '211 TLASER')).length)
      setLateSaw((pastJobsNo.filter(row => row.WorkCntr == '301 SAW')).length)
      setLateWeld((pastJobsNo.filter(row => row.WorkCntr == '402 WELD')).length)
      setLateAssy((pastJobsNo.filter(row => row.WorkCntr == '702 ASSEM')).length)
      setLatePowder((pastJobsNo.filter(row => row.WorkCntr == '601 POWDER')).length)
      setLateOSV(((pastJobsNo.filter(row => row.User_Text2 == '6. OUTSOURCE')).length));

      const totalLateSum = pastJobsNo.reduce((sum, job) => {
        const value = (job.QtyOrdered - job.QtyShipped2Cust) * job.UnitPrice;
        return sum + value;
      }, 0);
      setLateSum(totalLateSum);

      setFutureEng((sortedJobsNo.filter(row => row.WorkCntr == '101 ENGIN')).length - (pastJobsNo.filter(row => row.WorkCntr == '101 ENGIN')).length)
      setFutureShear((sortedJobsNo.filter(row => row.WorkCntr == '201 SHEAR')).length - (pastJobsNo.filter(row => row.WorkCntr == '201 SHEAR')).length)
      setFuturePunch((sortedJobsNo.filter(row => row.WorkCntr == '202 PUNCH')).length - (pastJobsNo.filter(row => row.WorkCntr == '202 PUNCH')).length)
      setFutureLaser((sortedJobsNo.filter(row => row.WorkCntr == '203 LASER')).length - (pastJobsNo.filter(row => row.WorkCntr == '203 LASER')).length)
      setFutureBrake((sortedJobsNo.filter(row => row.WorkCntr == '204 BRAKE')).length - (pastJobsNo.filter(row => row.WorkCntr == '204 BRAKE')).length)
      setFutureHard((sortedJobsNo.filter(row => row.WorkCntr == '206 HARD')).length - (pastJobsNo.filter(row => row.WorkCntr == '206 HARD')).length)
      setFutureTLaser((sortedJobsNo.filter(row => row.WorkCntr == '211 TLASER')).length - (pastJobsNo.filter(row => row.WorkCntr == '211 TLASER')).length)
      setFutureSaw((sortedJobsNo.filter(row => row.WorkCntr == '301 SAW')).length - (pastJobsNo.filter(row => row.WorkCntr == '301 SAW')).length)
      setFutureWeld((sortedJobsNo.filter(row => row.WorkCntr == '402 WELD')).length - (pastJobsNo.filter(row => row.WorkCntr == '402 WELD')).length)
      setFutureAssy((sortedJobsNo.filter(row => row.WorkCntr == '702 ASSEM')).length - (pastJobsNo.filter(row => row.WorkCntr == '702 ASSEM')).length)
      setFuturePowder((sortedJobsNo.filter(row => row.WorkCntr == '601 POWDER')).length - (pastJobsNo.filter(row => row.WorkCntr == '601 POWDER')).length)
      setFutureOSV((sortedJobsNo.filter(row => row.User_Text2 == '6. OUTSOURCE')).length - (pastJobsNo.filter(row => row.User_Text2 == '6. OUTSOURCE')).length);

      const totalFutureSum = sortedJobsNo.reduce((sum, job) => {
        const value = (job.QtyOrdered - job.QtyShipped2Cust) * job.UnitPrice;
        return sum + value;
      }, 0);
      setFutureSum(totalFutureSum - totalLateSum);

      setCurrent(months[thisMonthNo]);
      setNextMonth(months[nextMonthNo]);
      setFutureMonths(`${months[futureMonthNo]} +`);
      setOverview(`Overview (${months[thisMonthNo]})`);
      setPastJobs(pastJobs);
      setFutureJobs(futureJobs);
    } catch (err) {
      console.error(err);
    }
  };

  async function toggleEmail(id) {
    updateEmail(id);
    setUpdate('Email');
  }

  async function toggleHold(id) {
    updateHold(id);
    setUpdate('Hold');
  }

  const toggleSub = async (JobNo) => {
    if (expandedRows.includes(JobNo)) {
      setExpandedRows(expandedRows.filter(row => row !== JobNo));
    } else {
      try {
        const subs = await getAllSubJobs(JobNo);
        setSubJobs({
          ...subJobs,
          [JobNo]: subs
        });
        setExpandedRows([...expandedRows, JobNo]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const toggleRoute = async (job) => {
    try {
      const routing = await getSingleJob(job.JobNo);
      handleOpenRoute(job, routing);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseRoute = () => setShowRoute(false);
  const handleOpenRoute = (job, routing) => {
    setJobNo(job.JobNo);
    setJobType(job.User_Text3);
    setPartNo(job.PartNo);
    setPartRev(job.Revision);
    setCustCode(job.CustCode);
    setRouting(routing);
    setShowRoute(true);
  };

  const handleOpenJob = (job) => {
    setId(job.dataValues.id);
    setBlNotes(job.dataValues.blnotes);
    setOsvNotes(job.dataValues.osvnotes);
    setCdate(job.dataValues.cdate);
    setEmail(job.dataValues.email);
    setHold(job.dataValues.hold);
    setShowEdit(true)
  };

  const handleCancel = () => {
    setId('');
    setBlNotes('');
    setOsvNotes('');
    setCdate('');
    setEmail(0);
    setHold(0);
    setShowEdit(false);
  };

  const handleUpdate = async () => {
    try {
      await updateJob(id, blNotes, osvNotes, cdate);
      setId(0);
      setBlNotes('');
      setOsvNotes('');
      setCdate('');
      setShowEdit(false);
    } catch (err) {
      console.error(err);
    } finally {
      updateData();
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  }

  useEffect(() => {
    fetchData();
    setUpdate('');
  }, [update]);

  const donutDataJobs = {
    labels: ['Late', 'Future'],
    datasets: [
      {
        label: 'Jobs',
        data: [
          (lateJobs),
          (upcomingJobs)
        ],
        backgroundColor: [
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(153, 102, 255, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Chart.js Bar Chart',
      },
    },
    onClick: function (event, element) {
      console.log(element)
    },
  };

  const labels = ['Eng', 'Shear', 'Punch', 'Laser', 'Brake', 'Hard', 'TLaser', 'Saw', 'Weld', 'Assy', 'Powder', 'OSV'];

  const data = {
    labels,
    datasets: [
      {
        label: 'Late',
        data: [lateEng, lateShear, latePunch, lateLaser, lateBrake, lateHard, lateTLaser, lateSaw, lateWeld, lateAssy, latePowder, lateOSV],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Future',
        data: [futureEng, futureShear, futurePunch, futureLaser, futureBrake, futureHard, futureTLaser, futureSaw, futureWeld, futureAssy, futurePowder, futureOSV],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const monthsColumnConfig = [
    { label: '', width: '2%', isSearchable: false },
    { label: 'Order No', width: '7%', isSearchable: true, value: searchedValueOrderNo, onChange: (e) => setSearchedValueOrderNo(e.target.value), placeholder: 'Order No' },
    { label: 'Job No', width: '7%', isSearchable: true, value: searchedValueJobNo, onChange: (e) => setSearchedValueJobNo(e.target.value), placeholder: 'Job No' },
    { label: 'Due Date', width: '7%', isSearchable: false },
    { label: 'Customer', width: '7%', isSearchable: true, value: searchedValueCustomer, onChange: (e) => setSearchedValueCustomer(e.target.value), placeholder: 'Customer' },
    { label: 'Quantity', width: '7%', isSearchable: false },
    { label: 'Total Price', width: '7%', isSearchable: false },
    { label: 'Current Area', width: '10%', isSearchable: true, value: searchedValueArea, onChange: (e) => setSearchedValueArea(e.target.value), placeholder: 'Current Area' },
    { label: 'OSV', width: '5%', isSearchable: true, value: searchedValueOSV, onChange: (e) => setSearchedValueOSV(e.target.value), placeholder: 'OSV' },
    { label: 'OSV Status', width: '11%', isSearchable: false },
    { label: 'Commitment Date', width: '10%', isSearchable: false },
    { label: 'Notes', width: '20%', isSearchable: false },
  ];

  return (
    <PageContainer loading={loading} title='Backlog'>
      {cookieData.backlog ? (
        <>
          <CustomTabs
            selectedTab={selectedTab}
            handleTabChange={handleTabChange}
            tabLabels={[current, nextMonth, futureMonths, overview]}
          />

          {/* CURRENT MONTH */}

          <Box>
            {selectedTab === 0 && (
              <Box sx={{ padding: '12px' }}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <CustomHeader columns={monthsColumnConfig} />
                    </TableHead>
                    <TableBody>
                      {pastJobs
                        .filter((row) =>
                          !searchedValueOrderNo || row.OrderNo.toString().toLowerCase().includes(searchedValueOrderNo.toString().toLowerCase())
                        )
                        .filter((row) =>
                          !searchedValueJobNo || row.JobNo.toString().toLowerCase().includes(searchedValueJobNo.toString().toLowerCase())
                        )
                        .filter((row) =>
                          !searchedValueCustomer || row.CustCode.toString().toLowerCase().includes(searchedValueCustomer.toString().toLowerCase())
                        )
                        .filter((row) => {
                          const searchTarget = row.WorkCntr && row.User_Text2 !== '4. DONE' ? row.WorkCntr : row.User_Text2;
                          return !searchedValueArea ||
                            searchTarget.toString().toLowerCase().includes(searchedValueArea.toString().toLowerCase());
                        })
                        .filter((row) => {
                          if (!searchedValueOSV) { return true; }
                          if (!row || !row.VendCode) { return false; }

                          return row.VendCode.toString().toLowerCase().includes(searchedValueOSV.toString().toLowerCase())
                        })
                        .map((job, index) => {
                          const profitClass = job.OrderTotal > 5000 ? 'profit-row' : '';
                          const expediteClass = job.dataValues?.email ? 'bl-expedite-row' : '';
                          const holdClass = job.dataValues?.hold ? 'hold-row' : '';
                          const shipClass = job.User_Text2 == '4. DONE' ? 'ship-row' : '';
                          if (!job.MasterJobNo) {
                            rowIndex++;
                            return (
                              <Fragment key={index}>
                                <TableRow sx={{ backgroundColor: rowIndex % 2 === 0 ? '#f0f0f0' : '#fff' }} className={`${expediteClass} ${holdClass} ${profitClass} ${shipClass}`}>
                                  {job.HasSubs ?
                                    <DataTableCell padding={0}>
                                      <IconButton
                                        onClick={() => toggleSub(job.JobNo)}
                                        sx={{
                                          '&:focus': {
                                            outline: 'none',
                                          },
                                          '&:active': {
                                            backgroundColor: 'transparent',
                                          },
                                        }}
                                      >
                                        {job.JobNo && <AddIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                                      </IconButton>
                                    </DataTableCell>
                                    :
                                    <DataTableCell></DataTableCell>
                                  }
                                  <DataTableCell onClick={() => handleOpenJob(job)}>{job.OrderNo}</DataTableCell>
                                  <DataTableCell onClick={() => handleOpenJob(job)}>{job.JobNo}</DataTableCell>
                                  <DataTableCell>{job.DueDate.split('-')[1] + '/' + job.DueDate.split('-')[2].split('T')[0]}</DataTableCell>
                                  <DataTableCell>{job.CustCode}</DataTableCell>
                                  <DataTableCell>{job.QtyOrdered - job.QtyShipped2Cust}</DataTableCell>
                                  <DataTableCell>{((job.QtyOrdered - job.QtyShipped2Cust) * job.UnitPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</DataTableCell>
                                  {job.WorkCntr && job.User_Text2 !== '4. DONE' ?
                                    <DataTableCell onClick={() => toggleRoute(job)}>{(job.WorkCntr).split(' ')[1]}</DataTableCell>
                                    :
                                    <DataTableCell onClick={() => toggleRoute(job)}>{(job.User_Text2).split(' ')[1]}</DataTableCell>
                                  }
                                  {job.User_Text2 == '6. OUTSOURCE' ?
                                    <DataTableCell>{job.VendCode}</DataTableCell>
                                    :
                                    <DataTableCell></DataTableCell>
                                  }
                                  <DataTableCell onClick={() => handleOpenJob(job)}>{job.dataValues?.osvnotes}</DataTableCell>
                                  {job.dataValues?.cdate ?
                                    <DataTableCell onClick={() => handleOpenJob(job)}>{(job.dataValues.cdate).split('-')[1] + '/' + (job.dataValues.cdate).split('-')[2] + '/' + (job.dataValues.cdate).split('-')[0]}</DataTableCell>
                                    :
                                    <DataTableCell onClick={() => handleOpenJob(job)}></DataTableCell>
                                  }
                                  <DataTableCell onClick={() => handleOpenJob(job)}>{job.dataValues?.blnotes}</DataTableCell>
                                </TableRow>
                                {expandedRows.includes(job.JobNo) && subJobs[job.JobNo] && subJobs[job.JobNo].map((subJob, subIndex) => (
                                  <TableRow key={subIndex} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }} className='subjob-row'>
                                    <DataTableCell></DataTableCell>
                                    <DataTableCell>{subJob.OrderNo}</DataTableCell>
                                    <DataTableCell>{subJob.JobNo}</DataTableCell>
                                    <DataTableCell>{(subJob.DueDate).split('-')[1] + '/' + ((subJob.DueDate).split('-')[2]).split('T')[0]}</DataTableCell>
                                    <DataTableCell>{subJob.CustCode}</DataTableCell>
                                    <DataTableCell>{subJob.QtyOrdered - subJob.QtyShipped2Cust}</DataTableCell>
                                    <DataTableCell>{((subJob.QtyOrdered - subJob.QtyShipped2Cust) * subJob.UnitPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</DataTableCell>
                                    {subJob.WorkCntr && subJob.User_Text2 !== '4. DONE' ?
                                      <DataTableCell onClick={() => toggleRoute(subJob)}>{(subJob.WorkCntr).split(' ')[1]}</DataTableCell>
                                      :
                                      <DataTableCell onClick={() => toggleRoute(subJob)}>{(subJob.User_Text2).split(' ')[1]}</DataTableCell>
                                    }
                                    {subJob.User_Text2 == '6. OUTSOURCE' ?
                                      <DataTableCell>{subJob.VendCode}</DataTableCell>
                                      :
                                      <DataTableCell></DataTableCell>
                                    }
                                    <DataTableCell onClick={() => handleOpenJob(subJob)}>{subJob.dataValues?.osvnotes}</DataTableCell>
                                    {subJob.dataValues?.cdate ?
                                      <DataTableCell onClick={() => handleOpenJob(subJob)}>{(subJob.dataValues.cdate).split('-')[1] + '/' + (subJob.dataValues.cdate).split('-')[2] + '/' + (subJob.dataValues.cdate).split('-')[0]}</DataTableCell>
                                      :
                                      <DataTableCell onClick={() => handleOpenJob(subJob)}></DataTableCell>
                                    }
                                    <DataTableCell onClick={() => handleOpenJob(subJob)}>{subJob.dataValues?.blnotes}</DataTableCell>
                                  </TableRow>
                                ))}
                              </Fragment>
                            )
                          }
                        })
                      }

                      <TableRow>
                        <TableCell colSpan={12} align='center' sx={{ fontWeight: 'bold', fontSize: '15px', p: 1.25 }} className='empty-row late-row'>-</TableCell>
                      </TableRow>

                      {futureJobs
                        .filter((row) =>
                          !searchedValueOrderNo || row.OrderNo.toString().toLowerCase().includes(searchedValueOrderNo.toString().toLowerCase())
                        )
                        .filter((row) =>
                          !searchedValueJobNo || row.JobNo.toString().toLowerCase().includes(searchedValueJobNo.toString().toLowerCase())
                        )
                        .filter((row) =>
                          !searchedValueCustomer || row.CustCode.toString().toLowerCase().includes(searchedValueCustomer.toString().toLowerCase())
                        )
                        .filter((row) => {
                          const searchTarget = row.WorkCntr && row.User_Text2 !== '4. DONE' ? row.WorkCntr : row.User_Text2;
                          return !searchedValueArea ||
                            searchTarget.toString().toLowerCase().includes(searchedValueArea.toString().toLowerCase());
                        })
                        .filter((row) => {
                          if (!searchedValueOSV) { return true; }
                          if (!row || !row.VendCode) { return false; }

                          return row.VendCode.toString().toLowerCase().includes(searchedValueOSV.toString().toLowerCase())
                        })
                        .map((job, index) => {
                          const profitClass = job.OrderTotal > 5000 ? 'profit-row' : '';
                          const expediteClass = job.dataValues?.email ? 'bl-expedite-row' : '';
                          const holdClass = job.dataValues?.hold ? 'hold-row' : '';
                          const shipClass = job.User_Text2 == '4. DONE' ? 'ship-row' : '';
                          if (!job.MasterJobNo) {
                            rowIndex++;
                            return (
                              <Fragment key={index}>
                                <TableRow sx={{ backgroundColor: rowIndex % 2 === 0 ? '#f0f0f0' : '#fff' }} className={`${expediteClass} ${holdClass} ${profitClass} ${shipClass}`}>
                                  {job.HasSubs ?
                                    <DataTableCell padding={0}>
                                      <IconButton
                                        onClick={() => toggleSub(job.JobNo)}
                                        sx={{
                                          '&:focus': {
                                            outline: 'none',
                                          },
                                          '&:active': {
                                            backgroundColor: 'transparent',
                                          },
                                        }}
                                      >
                                        {job.JobNo && <AddIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                                      </IconButton>
                                    </DataTableCell>
                                    :
                                    <DataTableCell></DataTableCell>
                                  }
                                  <DataTableCell onClick={() => handleOpenJob(job)}>{job.OrderNo}</DataTableCell>
                                  <DataTableCell onClick={() => handleOpenJob(job)}>{job.JobNo}</DataTableCell>
                                  <DataTableCell>{job.DueDate.split('-')[1] + '/' + job.DueDate.split('-')[2].split('T')[0]}</DataTableCell>
                                  <DataTableCell>{job.CustCode}</DataTableCell>
                                  <DataTableCell>{job.QtyOrdered - job.QtyShipped2Cust}</DataTableCell>
                                  <DataTableCell>{((job.QtyOrdered - job.QtyShipped2Cust) * job.UnitPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</DataTableCell>
                                  {job.WorkCntr && job.User_Text2 !== '4. DONE' ?
                                    <DataTableCell onClick={() => toggleRoute(job)}>{(job.WorkCntr).split(' ')[1]}</DataTableCell>
                                    :
                                    <DataTableCell onClick={() => toggleRoute(job)}>{(job.User_Text2).split(' ')[1]}</DataTableCell>
                                  }
                                  {job.User_Text2 == '6. OUTSOURCE' ?
                                    <DataTableCell>{job.VendCode}</DataTableCell>
                                    :
                                    <DataTableCell></DataTableCell>
                                  }
                                  <DataTableCell onClick={() => handleOpenJob(job)}>{job.dataValues?.osvnotes}</DataTableCell>
                                  {job.dataValues?.cdate ?
                                    <DataTableCell onClick={() => handleOpenJob(job)}>{(job.dataValues.cdate).split('-')[1] + '/' + (job.dataValues.cdate).split('-')[2] + '/' + (job.dataValues.cdate).split('-')[0]}</DataTableCell>
                                    :
                                    <DataTableCell onClick={() => handleOpenJob(job)}></DataTableCell>
                                  }
                                  <DataTableCell onClick={() => handleOpenJob(job)}>{job.dataValues?.blnotes}</DataTableCell>
                                </TableRow>
                                {expandedRows.includes(job.JobNo) && subJobs[job.JobNo] && subJobs[job.JobNo].map((subJob, subIndex) => (
                                  <TableRow key={subIndex} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }} className='subjob-row'>
                                    <DataTableCell></DataTableCell>
                                    <DataTableCell>{subJob.OrderNo}</DataTableCell>
                                    <DataTableCell>{subJob.JobNo}</DataTableCell>
                                    <DataTableCell>{(subJob.DueDate).split('-')[1] + '/' + ((subJob.DueDate).split('-')[2]).split('T')[0]}</DataTableCell>
                                    <DataTableCell>{subJob.CustCode}</DataTableCell>
                                    <DataTableCell>{subJob.QtyOrdered - subJob.QtyShipped2Cust}</DataTableCell>
                                    <DataTableCell>{((subJob.QtyOrdered - subJob.QtyShipped2Cust) * subJob.UnitPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</DataTableCell>
                                    {subJob.WorkCntr && subJob.User_Text2 !== '4. DONE' ?
                                      <DataTableCell onClick={() => toggleRoute(subJob)}>{(subJob.WorkCntr).split(' ')[1]}</DataTableCell>
                                      :
                                      <DataTableCell onClick={() => toggleRoute(subJob)}>{(subJob.User_Text2).split(' ')[1]}</DataTableCell>
                                    }
                                    {subJob.User_Text2 == '6. OUTSOURCE' ?
                                      <DataTableCell>{subJob.VendCode}</DataTableCell>
                                      :
                                      <DataTableCell></DataTableCell>
                                    }
                                    <DataTableCell onClick={() => handleOpenJob(subJob)}>{subJob.dataValues?.osvnotes}</DataTableCell>
                                    {subJob.dataValues?.cdate ?
                                      <DataTableCell onClick={() => handleOpenJob(subJob)}>{(subJob.dataValues.cdate).split('-')[1] + '/' + (subJob.dataValues.cdate).split('-')[2] + '/' + (subJob.dataValues.cdate).split('-')[0]}</DataTableCell>
                                      :
                                      <DataTableCell onClick={() => handleOpenJob(subJob)}></DataTableCell>
                                    }
                                    <DataTableCell onClick={() => handleOpenJob(subJob)}>{subJob.dataValues?.blnotes}</DataTableCell>
                                  </TableRow>
                                ))}
                              </Fragment>
                            )
                          }
                        })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>

          {/* NEXT MONTH */}

          <Box>
            {selectedTab === 1 && (
              <Box sx={{ padding: '12px' }}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <CustomHeader columns={monthsColumnConfig} />
                    </TableHead>
                    <TableBody>
                      {nextMonthJobs
                        .filter((row) =>
                          !searchedValueOrderNo || row.OrderNo.toString().toLowerCase().includes(searchedValueOrderNo.toString().toLowerCase())
                        )
                        .filter((row) =>
                          !searchedValueJobNo || row.JobNo.toString().toLowerCase().includes(searchedValueJobNo.toString().toLowerCase())
                        )
                        .filter((row) =>
                          !searchedValueCustomer || row.CustCode.toString().toLowerCase().includes(searchedValueCustomer.toString().toLowerCase())
                        )
                        .filter((row) => {
                          const searchTarget = row.WorkCntr && row.User_Text2 !== '4. DONE' ? row.WorkCntr : row.User_Text2;
                          return !searchedValueArea ||
                            searchTarget.toString().toLowerCase().includes(searchedValueArea.toString().toLowerCase());
                        })
                        .filter((row) => {
                          if (!searchedValueOSV) { return true; }
                          if (!row || !row.VendCode) { return false; }

                          return row.VendCode.toString().toLowerCase().includes(searchedValueOSV.toString().toLowerCase())
                        })
                        .map((job, index) => {
                          const profitClass = job.OrderTotal > 5000 ? 'profit-row' : '';
                          const expediteClass = job.dataValues?.email ? 'bl-expedite-row' : '';
                          const holdClass = job.dataValues?.hold ? 'hold-row' : '';
                          const shipClass = job.User_Text2 == '4. DONE' ? 'ship-row' : '';
                          if (!job.MasterJobNo) {
                            rowIndex++;
                            return (
                              <Fragment key={index}>
                                <TableRow sx={{ backgroundColor: rowIndex % 2 === 0 ? '#f0f0f0' : '#fff' }} className={`${expediteClass} ${holdClass} ${profitClass} ${shipClass}`}>
                                  {job.HasSubs ?
                                    <DataTableCell padding={0}>
                                      <IconButton
                                        onClick={() => toggleSub(job.JobNo)}
                                        sx={{
                                          '&:focus': {
                                            outline: 'none',
                                          },
                                          '&:active': {
                                            backgroundColor: 'transparent',
                                          },
                                        }}
                                      >
                                        {job.JobNo && <AddIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                                      </IconButton>
                                    </DataTableCell>
                                    :
                                    <DataTableCell></DataTableCell>
                                  }
                                  <DataTableCell onClick={() => handleOpenJob(job)}>{job.OrderNo}</DataTableCell>
                                  <DataTableCell onClick={() => handleOpenJob(job)}>{job.JobNo}</DataTableCell>
                                  <DataTableCell>{job.DueDate.split('-')[1] + '/' + job.DueDate.split('-')[2].split('T')[0]}</DataTableCell>
                                  <DataTableCell>{job.CustCode}</DataTableCell>
                                  <DataTableCell>{job.QtyOrdered - job.QtyShipped2Cust}</DataTableCell>
                                  <DataTableCell>{((job.QtyOrdered - job.QtyShipped2Cust) * job.UnitPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</DataTableCell>
                                  {job.WorkCntr && job.User_Text2 !== '4. DONE' ?
                                    <DataTableCell onClick={() => toggleRoute(job)}>{(job.WorkCntr).split(' ')[1]}</DataTableCell>
                                    :
                                    <DataTableCell onClick={() => toggleRoute(job)}>{(job.User_Text2).split(' ')[1]}</DataTableCell>
                                  }
                                  {job.User_Text2 == '6. OUTSOURCE' ?
                                    <DataTableCell>{job.VendCode}</DataTableCell>
                                    :
                                    <DataTableCell></DataTableCell>
                                  }
                                  <DataTableCell onClick={() => handleOpenJob(job)}>{job.dataValues?.osvnotes}</DataTableCell>
                                  {job.dataValues?.cdate ?
                                    <DataTableCell onClick={() => handleOpenJob(job)}>{(job.dataValues.cdate).split('-')[1] + '/' + (job.dataValues.cdate).split('-')[2] + '/' + (job.dataValues.cdate).split('-')[0]}</DataTableCell>
                                    :
                                    <DataTableCell onClick={() => handleOpenJob(job)}></DataTableCell>
                                  }
                                  <DataTableCell onClick={() => handleOpenJob(job)}>{job.dataValues?.blnotes}</DataTableCell>
                                </TableRow>
                                {expandedRows.includes(job.JobNo) && subJobs[job.JobNo] && subJobs[job.JobNo].map((subJob, subIndex) => (
                                  <TableRow key={subIndex} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }} className='subjob-row'>
                                    <DataTableCell></DataTableCell>
                                    <DataTableCell>{subJob.OrderNo}</DataTableCell>
                                    <DataTableCell>{subJob.JobNo}</DataTableCell>
                                    <DataTableCell>{(subJob.DueDate).split('-')[1] + '/' + ((subJob.DueDate).split('-')[2]).split('T')[0]}</DataTableCell>
                                    <DataTableCell>{subJob.CustCode}</DataTableCell>
                                    <DataTableCell>{subJob.QtyOrdered - subJob.QtyShipped2Cust}</DataTableCell>
                                    <DataTableCell>{((subJob.QtyOrdered - subJob.QtyShipped2Cust) * subJob.UnitPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</DataTableCell>
                                    {subJob.WorkCntr && subJob.User_Text2 !== '4. DONE' ?
                                      <DataTableCell onClick={() => toggleRoute(subJob)}>{(subJob.WorkCntr).split(' ')[1]}</DataTableCell>
                                      :
                                      <DataTableCell onClick={() => toggleRoute(subJob)}>{(subJob.User_Text2).split(' ')[1]}</DataTableCell>
                                    }
                                    {subJob.User_Text2 == '6. OUTSOURCE' ?
                                      <DataTableCell>{subJob.VendCode}</DataTableCell>
                                      :
                                      <DataTableCell></DataTableCell>
                                    }
                                    <DataTableCell onClick={() => handleOpenJob(subJob)}>{subJob.dataValues?.osvnotes}</DataTableCell>
                                    {subJob.dataValues?.cdate ?
                                      <DataTableCell onClick={() => handleOpenJob(subJob)}>{(subJob.dataValues.cdate).split('-')[1] + '/' + (subJob.dataValues.cdate).split('-')[2] + '/' + (subJob.dataValues.cdate).split('-')[0]}</DataTableCell>
                                      :
                                      <DataTableCell onClick={() => handleOpenJob(subJob)}></DataTableCell>
                                    }
                                    <DataTableCell onClick={() => handleOpenJob(subJob)}>{subJob.dataValues?.blnotes}</DataTableCell>
                                  </TableRow>
                                ))}
                              </Fragment>
                            )
                          }
                        })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>

          {/* FUTURE MONTHS */}

          <Box>
            {selectedTab === 2 && (
              <Box sx={{ padding: '12px' }}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <CustomHeader columns={monthsColumnConfig} />
                    </TableHead>
                    <TableBody>
                      {allFutureJobs
                        .filter((row) =>
                          !searchedValueOrderNo || row.OrderNo.toString().toLowerCase().includes(searchedValueOrderNo.toString().toLowerCase())
                        )
                        .filter((row) =>
                          !searchedValueJobNo || row.JobNo.toString().toLowerCase().includes(searchedValueJobNo.toString().toLowerCase())
                        )
                        .filter((row) =>
                          !searchedValueCustomer || row.CustCode.toString().toLowerCase().includes(searchedValueCustomer.toString().toLowerCase())
                        )
                        .filter((row) => {
                          const searchTarget = row.WorkCntr && row.User_Text2 !== '4. DONE' ? row.WorkCntr : row.User_Text2;
                          return !searchedValueArea ||
                            searchTarget.toString().toLowerCase().includes(searchedValueArea.toString().toLowerCase());
                        })
                        .filter((row) => {
                          if (!searchedValueOSV) { return true; }
                          if (!row || !row.VendCode) { return false; }

                          return row.VendCode.toString().toLowerCase().includes(searchedValueOSV.toString().toLowerCase())
                        })
                        .map((job, index) => {
                          const profitClass = job.OrderTotal > 5000 ? 'profit-row' : '';
                          const expediteClass = job.dataValues?.email ? 'bl-expedite-row' : '';
                          const holdClass = job.dataValues?.hold ? 'hold-row' : '';
                          const shipClass = job.User_Text2 == '4. DONE' ? 'ship-row' : '';
                          if (!job.MasterJobNo) {
                            rowIndex++;
                            return (
                              <Fragment key={index}>
                                <TableRow sx={{ backgroundColor: rowIndex % 2 === 0 ? '#f0f0f0' : '#fff' }} className={`${expediteClass} ${holdClass} ${profitClass} ${shipClass}`}>
                                  {job.HasSubs ?
                                    <DataTableCell padding={0}>
                                      <IconButton
                                        onClick={() => toggleSub(job.JobNo)}
                                        sx={{
                                          '&:focus': {
                                            outline: 'none',
                                          },
                                          '&:active': {
                                            backgroundColor: 'transparent',
                                          },
                                        }}
                                      >
                                        {job.JobNo && <AddIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                                      </IconButton>
                                    </DataTableCell>
                                    :
                                    <DataTableCell></DataTableCell>
                                  }
                                  <DataTableCell onClick={() => handleOpenJob(job)}>{job.OrderNo}</DataTableCell>
                                  <DataTableCell onClick={() => handleOpenJob(job)}>{job.JobNo}</DataTableCell>
                                  <DataTableCell>{job.DueDate.split('-')[1] + '/' + job.DueDate.split('-')[2].split('T')[0]}</DataTableCell>
                                  <DataTableCell>{job.CustCode}</DataTableCell>
                                  <DataTableCell>{job.QtyOrdered - job.QtyShipped2Cust}</DataTableCell>
                                  <DataTableCell>{((job.QtyOrdered - job.QtyShipped2Cust) * job.UnitPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</DataTableCell>
                                  {job.WorkCntr && job.User_Text2 !== '4. DONE' ?
                                    <DataTableCell onClick={() => toggleRoute(job)}>{(job.WorkCntr).split(' ')[1]}</DataTableCell>
                                    :
                                    <DataTableCell onClick={() => toggleRoute(job)}>{(job.User_Text2).split(' ')[1]}</DataTableCell>
                                  }
                                  {job.User_Text2 == '6. OUTSOURCE' ?
                                    <DataTableCell>{job.VendCode}</DataTableCell>
                                    :
                                    <DataTableCell></DataTableCell>
                                  }
                                  <DataTableCell onClick={() => handleOpenJob(job)}>{job.dataValues?.osvnotes}</DataTableCell>
                                  {job.dataValues?.cdate ?
                                    <DataTableCell onClick={() => handleOpenJob(job)}>{(job.dataValues.cdate).split('-')[1] + '/' + (job.dataValues.cdate).split('-')[2] + '/' + (job.dataValues.cdate).split('-')[0]}</DataTableCell>
                                    :
                                    <DataTableCell onClick={() => handleOpenJob(job)}></DataTableCell>
                                  }
                                  <DataTableCell onClick={() => handleOpenJob(job)}>{job.dataValues?.blnotes}</DataTableCell>
                                </TableRow>
                                {expandedRows.includes(job.JobNo) && subJobs[job.JobNo] && subJobs[job.JobNo].map((subJob, subIndex) => (
                                  <TableRow key={subIndex} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }} className='subjob-row'>
                                    <DataTableCell></DataTableCell>
                                    <DataTableCell>{subJob.OrderNo}</DataTableCell>
                                    <DataTableCell>{subJob.JobNo}</DataTableCell>
                                    <DataTableCell>{(subJob.DueDate).split('-')[1] + '/' + ((subJob.DueDate).split('-')[2]).split('T')[0]}</DataTableCell>
                                    <DataTableCell>{subJob.CustCode}</DataTableCell>
                                    <DataTableCell>{subJob.QtyOrdered - subJob.QtyShipped2Cust}</DataTableCell>
                                    <DataTableCell>{((subJob.QtyOrdered - subJob.QtyShipped2Cust) * subJob.UnitPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</DataTableCell>
                                    {subJob.WorkCntr && subJob.User_Text2 !== '4. DONE' ?
                                      <DataTableCell onClick={() => toggleRoute(subJob)}>{(subJob.WorkCntr).split(' ')[1]}</DataTableCell>
                                      :
                                      <DataTableCell onClick={() => toggleRoute(subJob)}>{(subJob.User_Text2).split(' ')[1]}</DataTableCell>
                                    }
                                    {subJob.User_Text2 == '6. OUTSOURCE' ?
                                      <DataTableCell>{subJob.VendCode}</DataTableCell>
                                      :
                                      <DataTableCell></DataTableCell>
                                    }
                                    <DataTableCell onClick={() => handleOpenJob(subJob)}>{subJob.dataValues?.osvnotes}</DataTableCell>
                                    {subJob.dataValues?.cdate ?
                                      <DataTableCell onClick={() => handleOpenJob(subJob)}>{(subJob.dataValues.cdate).split('-')[1] + '/' + (subJob.dataValues.cdate).split('-')[2] + '/' + (subJob.dataValues.cdate).split('-')[0]}</DataTableCell>
                                      :
                                      <DataTableCell onClick={() => handleOpenJob(subJob)}></DataTableCell>
                                    }
                                    <DataTableCell onClick={() => handleOpenJob(subJob)}>{subJob.dataValues?.blnotes}</DataTableCell>
                                  </TableRow>
                                ))}
                              </Fragment>
                            )
                          }
                        })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>

          {/* OVERVIEW */}

          <Box>
            {selectedTab === 3 && (
              <Box sx={{ padding: '12px' }}>
                3
              </Box>
            )}
          </Box>

          {/* ACTIVE JOBS */}

          <Box>
            {selectedTab === 4 && (
              <Box sx={{ padding: '12px' }}>
                4
              </Box>
            )}
          </Box>
        </>
      ) : (
        <Box sx={{ width: '100%', textAlign: 'center', alignContent: 'center', overflowY: 'auto', height: '100vh' }}>
          <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>You Don't Have Access To This Page</Typography>
        </Box>
      )
      }
    </PageContainer >
  );
}