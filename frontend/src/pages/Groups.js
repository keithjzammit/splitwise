import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Card, CardContent, Container, Grid, Typography, TextField } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectToken } from '../features/userSlice';

const Groups = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector(selectToken);
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    fetchGroups();
  }, [token, navigate]);

  const fetchGroups = async () => {
    try {
      const response = await axios.get('http://localhost:8001/api/v1/groups/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setGroups(response.data);
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to fetch groups');
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8001/api/v1/groups/', {
        name: newGroupName,
        description: newGroupDescription
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNewGroupName('');
      setNewGroupDescription('');
      fetchGroups();
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to create group');
    }
  };

  return (
    <Container>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Typography variant="h4" component="h1" gutterBottom>
        Your Groups
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          onClick={() => navigate('/expenses')}
        >
          View Expenses
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <form onSubmit={handleCreateGroup}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Group Name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Description"
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Create Group
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>

      <Grid container spacing={3}>
        {groups.map((group) => (
          <Grid item xs={12} sm={6} md={4} key={group.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2">
                  {group.name}
                </Typography>
                <Typography color="text.secondary" paragraph>
                  {group.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Groups;
