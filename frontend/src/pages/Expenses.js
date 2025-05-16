import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Container, Grid, TextField, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectToken } from '../features/userSlice';

const Expenses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector(selectToken);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    payer_id: '',
    group_id: '',
    splits: []
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    fetchExpenses();
  }, [token, navigate]);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:8001/api/v1/expenses/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setExpenses(response.data);
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to fetch expenses');
    }
  };

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8001/api/v1/expenses/', newExpense, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNewExpense({
        description: '',
        amount: '',
        payer_id: '',
        group_id: '',
        splits: []
      });
      fetchExpenses();
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to create expense');
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
        Expenses
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          onClick={() => navigate('/groups')}
        >
          Back to Groups
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Add New Expense
        </Typography>
        <form onSubmit={handleCreateExpense}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Description"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Add Expense
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Payer</TableCell>
              <TableCell align="right">Group</TableCell>
              <TableCell align="right">Splits</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell component="th" scope="row">
                  {expense.description}
                </TableCell>
                <TableCell align="right">${expense.amount}</TableCell>
                <TableCell align="right">{expense.payer?.email}</TableCell>
                <TableCell align="right">{expense.group?.name}</TableCell>
                <TableCell align="right">
                  {expense.splits?.length || 0}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Expenses;
