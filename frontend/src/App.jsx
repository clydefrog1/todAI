import { useState } from 'react';
import { Container, Typography, Box, Button, Tabs, Tab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ViewListIcon from '@mui/icons-material/ViewList';
import TodayIcon from '@mui/icons-material/Today';
import UpcomingIcon from '@mui/icons-material/Upcoming';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useDispatch, useSelector } from 'react-redux';
import { SnackbarProvider } from './context/SnackbarContext';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskFilters from './components/TaskFilters';
import { resetFilters, setViewMode, selectViewMode } from './store/slices/taskSlice';

const VIEW_MODE_TABS = [
  { value: 'all', label: 'All Tasks', icon: <ViewListIcon /> },
  { value: 'today', label: 'Today', icon: <TodayIcon /> },
  { value: 'upcoming', label: 'Upcoming', icon: <UpcomingIcon /> },
  { value: 'completed', label: 'Completed', icon: <DoneAllIcon /> },
];

function AppContent() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const dispatch = useDispatch();
  const viewMode = useSelector(selectViewMode);

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

  const handleViewModeChange = (event, newValue) => {
    if (newValue !== null) {
      dispatch(setViewMode(newValue));
    }
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

      {/* View Mode Tabs */}
      <Box sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={viewMode}
          onChange={handleViewModeChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="task view modes"
        >
          {VIEW_MODE_TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
              sx={{ textTransform: 'none', minHeight: 48 }}
            />
          ))}
        </Tabs>
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
