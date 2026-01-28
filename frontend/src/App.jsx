import { useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch } from 'react-redux';
import { SnackbarProvider } from './context/SnackbarContext';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskFilters from './components/TaskFilters';
import { resetFilters } from './store/slices/taskSlice';

function AppContent() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const dispatch = useDispatch();

  const handleOpenCreate = () => {
    setSelectedTask(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (task) => {
    setSelectedTask(task);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedTask(null);
  };

  const handleClearFilters = () => {
    dispatch(resetFilters());
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          todAI
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          New Task
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 3 }}>
        <TaskFilters />
      </Box>

      {/* Task List */}
      <TaskList
        onEditTask={handleOpenEdit}
        onCreateTask={handleOpenCreate}
        onClearFilters={handleClearFilters}
      />

      {/* Task Form Dialog */}
      <TaskForm
        open={formOpen}
        onClose={handleCloseForm}
        task={selectedTask}
      />
    </Container>
  );
}

function App() {
  return (
    <SnackbarProvider>
      <AppContent />
    </SnackbarProvider>
  );
}

export default App;
