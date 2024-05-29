import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Table } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import FoundeverLogo from '../assets/images/Foundeverlogo.png';
import styles from './TaskTimer.module.css';

const TaskTimer = () => {
  const [tasks, setTasks] = useState([]); // State to store tasks
  const [times, setTimes] = useState([]); // State to store task times
  const [startTime, setStartTime] = useState(null); // State to store start time of a task
  const [totalTime, setTotalTime] = useState(null); // State to store total time of all tasks
  const navigate = useNavigate(); // Hook to navigate between routes

  // useEffect to load stored tasks and times from localStorage on component mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const storedTimes = JSON.parse(localStorage.getItem('times')) || [];
    const storedTotalTime = JSON.parse(localStorage.getItem('totalTime')) || null;
    setTasks(storedTasks);
    setTimes(storedTimes);
    setTotalTime(storedTotalTime);
  }, []);

  // Function to start timing a task
  const startTiming = (index) => {
    const endTime = new Date(); // Get the current time
    const duration = (endTime - startTime) / 1000; // Calculate duration in seconds
    const newTimes = [...times, { task: tasks[index], duration }]; // Add the task and its duration to times
    setTimes(newTimes);
    localStorage.setItem('times', JSON.stringify(newTimes)); // Save updated times to localStorage
    setStartTime(endTime); // Set the end time as the new start time for the next task
  };

  // Function to start the time-motion exercise
  const startTM = () => {
    const initialTime = new Date(); // Get the current time
    const initialTimes = [...times, { task: 'Start TM', duration: 0 }]; // Add an initial task with zero duration
    setTimes(initialTimes);
    setStartTime(initialTime); // Set the start time
    localStorage.setItem('times', JSON.stringify(initialTimes)); // Save updated times to localStorage
  };

  // Function to end the timing and calculate the total time
  const endTiming = () => {
    const newTotalTime = times.reduce((sum, t) => sum + t.duration, 0); // Sum up all task durations
    setTotalTime(newTotalTime);
    localStorage.setItem('totalTime', JSON.stringify(newTotalTime)); // Save total time to localStorage
  };

  // Function to undo the last task
  const undoLastTask = () => {
    if (times.length > 0) {
      const newTimes = times.slice(0, -1); // Remove the last task from times
      setTimes(newTimes);
      localStorage.setItem('times', JSON.stringify(newTimes)); // Save updated times to localStorage
    }
  };

  // Function to clear all tasks and times
  const clearAll = () => {
    setTimes([]); // Clear the times
    setTotalTime(null); // Clear the total time
    localStorage.removeItem('times');
    localStorage.removeItem('totalTime');
  };

  // Function to export times to an Excel file
  const exportToExcel = () => {
    const timesWithTotal = [...times];
    if (totalTime !== null) {
      timesWithTotal.push({ task: 'Total Duration', duration: totalTime }); // Add total duration to the times array
    }
    const ws = XLSX.utils.json_to_sheet(timesWithTotal); // Convert times to a worksheet
    const wb = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Times'); // Append the worksheet to the workbook
    XLSX.writeFile(wb, 'time_motion_data.xlsx'); // Write the workbook to a file
  };

  // Function to navigate back to the previous page
  const goBack = () => {
    navigate('/');
  };

  return (
    <div className={styles.taskTimerContainer}>
      <Container>
        {/* Display the logo */}
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <img src={FoundeverLogo} alt="Foundever Logo" style={{ width: '50%', maxWidth: '50%', margin: '20px 0' }} />
        </div>
        <Row>
          <Col>
            <h2>Tasks</h2>
            <div>
              {/* Button to start the time-motion exercise */}
              <Button variant="primary" onClick={startTM} style={{ margin: '8px' }}>
                Start TM
              </Button>
              {/* Display buttons for each task */}
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
                  {/* Display the last 10 tasks and their durations */}
                  {times.slice(-10).map((time, index) => (
                    <tr key={index}>
                      <td>{time.task}</td>
                      <td>{time.duration}</td>
                    </tr>
                  ))}
                  {/* Display total duration if it exists */}
                  {totalTime !== null && (
                    <tr>
                      <td>Total Duration</td>
                      <td>{totalTime}</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
            {/* Button to export times to Excel */}
            <Button variant="success" onClick={exportToExcel} style={{ margin: '8px' }}>
              Export to Excel
            </Button>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {/* Button to end the timing */}
              <Button variant="danger" onClick={endTiming} style={{ margin: '8px' }}>
                End TM
              </Button>
              {/* Button to clear all tasks and times */}
              <Button variant="danger" onClick={clearAll} style={{ margin: '8px' }}>
                Clear All
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
      {/* Undo and Back buttons */}
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
