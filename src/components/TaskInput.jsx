import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';
import FoundeverLogo from '../assets/images/Foundeverlogo.png';

const TaskInput = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  const handleTaskChange = (e) => {
    setTask(e.target.value);
  };

  const addTask = () => {
    if (task) {
      const newTasks = [...tasks, task];
      setTasks(newTasks);
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      setTask('');
    }
  };

  const clearAllTasks = () => {
    setTasks([]);
    localStorage.removeItem('tasks');
  };

  const deleteLastTask = () => {
    const newTasks = tasks.slice(0, -1);
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const goToTaskTimer = () => {
    navigate('/tasks');
  };

  return (
    <Container>
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <img src={FoundeverLogo} alt="Foundever Logo" style={{ width: '50%', maxWidth: '50%', margin: '20px 0' }} />
      </div>
      <Form>
        <h2 style={{ marginBottom: '16px' }}>Add Task</h2>
        <Form.Group controlId="formTask">
          <Form.Control type="text" value={task} onChange={handleTaskChange} />
        </Form.Group>
        <Button variant="primary" onClick={addTask} style={{ margin: '8px' }}>Add Task</Button>
        <Button variant="danger" onClick={clearAllTasks} style={{ margin: '8px' }}>Clear All</Button>
        <Button variant="warning" onClick={deleteLastTask} disabled={tasks.length === 0} style={{ margin: '8px' }}>Delete Last Task</Button>
      </Form>

      <h2 style={{ marginBottom: '16px' }}>Tasks Added</h2>
      <ListGroup>
        {tasks.map((task, index) => (
          <ListGroup.Item key={index}>{task}</ListGroup.Item>
        ))}
      </ListGroup>

      <Button variant="secondary" onClick={goToTaskTimer} style={{ margin: '8px', fontSize: '110%' }}>Next</Button>
    </Container>
  );
};

export default TaskInput;
