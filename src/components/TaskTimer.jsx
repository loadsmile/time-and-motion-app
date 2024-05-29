import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Table } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import FoundeverLogo from '../assets/images/Foundeverlogo.png';
import styles from './TaskTimer.module.css';

const TaskTimer = () => {
  const [tasks, setTasks] = useState([]);
  const [times, setTimes] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [totalTime, setTotalTime] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const storedTimes = JSON.parse(localStorage.getItem('times')) || [];
    const storedTotalTime = JSON.parse(localStorage.getItem('totalTime')) || null;
    setTasks(storedTasks);
    setTimes(storedTimes);
    setTotalTime(storedTotalTime);
  }, []);

  const startTiming = (index) => {
    const endTime = new Date();
    const duration = (endTime - startTime) / 1000;
    const newTimes = [...times, { task: tasks[index], duration }];
    setTimes(newTimes);
    localStorage.setItem('times', JSON.stringify(newTimes));
    setStartTime(endTime);
  };

  const startTM = () => {
    const initialTime = new Date();
    const initialTimes = [...times, { task: 'Start TM', duration: 0 }];
    setTimes(initialTimes);
    setStartTime(initialTime);
    localStorage.setItem('times', JSON.stringify(initialTimes));
  };

  const endTiming = () => {
    const newTotalTime = times.reduce((sum, t) => sum + t.duration, 0);
    setTotalTime(newTotalTime);
    localStorage.setItem('totalTime', JSON.stringify(newTotalTime));
  };

  const undoLastTask = () => {
    if (times.length > 0) {
      const newTimes = times.slice(0, -1);
      setTimes(newTimes);
      localStorage.setItem('times', JSON.stringify(newTimes));
    }
  };

  const clearAll = () => {
    setTimes([]);
    setTotalTime(null);
    localStorage.removeItem('times');
    localStorage.removeItem('totalTime');
  };

  const exportToExcel = () => {
    const timesWithTotal = [...times];
    if (totalTime !== null) {
      timesWithTotal.push({ task: 'Total Duration', duration: totalTime });
    }
    const ws = XLSX.utils.json_to_sheet(timesWithTotal);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Times');
    XLSX.writeFile(wb, 'time_motion_data.xlsx');
  };

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className={styles.taskTimerContainer}>
      <Container>
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <img src={FoundeverLogo} alt="Foundever Logo" style={{ width: '50%', maxWidth: '50%', margin: '20px 0' }} />
        </div>
        <Row>
          <Col>
            <h2>Tasks</h2>
            <div>
              <Button variant="primary" onClick={startTM} style={{ margin: '8px' }}>
                Start TM
              </Button>
              {tasks.map((task, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  style={{ margin: '8px', fontSize: '110%' }}
                  onClick={() => startTiming(index)}
                >
                  {task}
                </Button>
              ))}
            </div>
          </Col>
          <Col>
            <h2>Times</h2>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Duration (seconds)</th>
                  </tr>
                </thead>
                <tbody>
                  {times.slice(-10).map((time, index) => (
                    <tr key={index}>
                      <td>{time.task}</td>
                      <td>{time.duration}</td>
                    </tr>
                  ))}
                  {totalTime !== null && (
                    <tr>
                      <td>Total Duration</td>
                      <td>{totalTime}</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
            <Button variant="success" onClick={exportToExcel} style={{ margin: '8px' }}>
              Export to Excel
            </Button>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="danger" onClick={endTiming} style={{ margin: '8px' }}>
                End TM
              </Button>
              <Button variant="danger" onClick={clearAll} style={{ margin: '8px' }}>
                Clear All
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
      <div className={styles.buttonGroup}>
        <Button variant="warning" onClick={undoLastTask} disabled={times.length === 0} style={{ margin: '8px' }}>
          Undo
        </Button>
        <Button variant="secondary" onClick={goBack} style={{ margin: '8px' }}>
          Back
        </Button>
      </div>
    </div>
  );
};

export default TaskTimer;
