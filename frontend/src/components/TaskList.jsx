import { useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Skeleton,
  Alert,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { grey, blue, green } from '@mui/material/colors';
import { useSelector } from 'react-redux';
import { useGetTasksQuery, useDeleteTaskMutation } from '../store/apiSlice';
import { selectFilter, selectSort, selectViewMode } from '../store/slices/taskSlice';
import { useSnackbar } from '../context/SnackbarContext';
import EmptyState from './EmptyState';
import { PROJECT_LABELS, PROJECT_COLORS } from '../constants/projects';

const statusColors = {
  todo: grey[500],
  'in-progress': blue[500],
  done: green[500],
};

const statusLabels = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

function TaskList({ onEditTask, onCreateTask, onClearFilters }) {
  const { data: tasks = [], isLoading, isError, error } = useGetTasksQuery();
  const [deleteTask] = useDeleteTaskMutation();
  const { showSnackbar } = useSnackbar();
  const filter = useSelector(selectFilter);
  const sort = useSelector(selectSort);
  const viewMode = useSelector(selectViewMode);

  // Helper functions for date comparisons
  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    const d = new Date(date);
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  };

  const isUpcoming = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);
    return d > today && d <= sevenDaysFromNow;
  };

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Filter by view mode first
    switch (viewMode) {
      case 'today':
        result = result.filter((task) => isToday(task.dueDate));
        break;
      case 'upcoming':
        result = result.filter((task) => isUpcoming(task.dueDate));
        break;
      case 'completed':
        result = result.filter((task) => task.status === 'done');
        break;
      case 'all':
      default:
        // No view mode filter for 'all'
        break;
    }

    // Filter by status (only if not in 'completed' view mode)
    if (filter.status !== 'all' && viewMode !== 'completed') {
      result = result.filter((task) => task.status === filter.status);
    }

    // Filter by project
    if (filter.project !== 'all') {
      result = result.filter((task) => task.project === filter.project);
    }

    // Filter by priority
    if (filter.priority !== 'all') {
      result = result.filter((task) => task.priority === filter.priority);
    }

    // Filter by search query
    if (filter.searchQuery.trim()) {
      const query = filter.searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sort.field) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'status': {
          const statusOrder = { todo: 0, 'in-progress': 1, done: 2 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        }
        case 'priority': {
          // Nulls last: tasks without priority go to the end
          const aPriority = a.priority ?? 10;
          const bPriority = b.priority ?? 10;
          comparison = aPriority - bPriority;
          break;
        }
        case 'dueDate': {
          // Nulls last: tasks without dueDate go to the end
          const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          comparison = aDate - bDate;
          break;
        }
        case 'createdAt':
        default:
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
      }
      return sort.order === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [tasks, filter, sort, viewMode]);

  const handleDelete = async (task) => {
    try {
      await deleteTask(task.id).unwrap();
      showSnackbar('Task deleted successfully', 'success');
    } catch (err) {
      showSnackbar(
        err?.data?.message || 'Failed to delete task',
        'error'
      );
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {[1, 2, 3].map((n) => (
          <Skeleton
            key={n}
            variant="rounded"
            height={120}
            animation="wave"
          />
        ))}
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error?.data?.message || 'Failed to load tasks. Please try again.'}
      </Alert>
    );
  }

  // No tasks at all
  if (tasks.length === 0) {
    return <EmptyState variant="empty" onCreateTask={onCreateTask} />;
  }

  // No tasks match filters
  if (filteredAndSortedTasks.length === 0) {
    return <EmptyState variant="no-results" onClearFilters={onClearFilters} />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {filteredAndSortedTasks.map((task) => (
        <Card key={task.id} sx={{ position: 'relative' }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 2,
              }}
            >
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1,
                    flexWrap: 'wrap',
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 500,
                      wordBreak: 'break-word',
                    }}
                  >
                    {task.title}
                  </Typography>
                  <Chip
                    label={statusLabels[task.status]}
                    size="small"
                    sx={{
                      backgroundColor: statusColors[task.status],
                      color: 'white',
                      fontWeight: 500,
                    }}
                  />
                  {task.project && (
                    <Chip
                      label={PROJECT_LABELS[task.project]}
                      size="small"
                      sx={{
                        backgroundColor: PROJECT_COLORS[task.project],
                        color: 'white',
                        fontWeight: 500,
                      }}
                    />
                  )}
                </Box>
                {task.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {task.description}
                  </Typography>
                )}
                  <Typography variant="caption" color="text.secondary" display="block">
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Updated: {new Date(task.updatedAt).toLocaleDateString()}
                  </Typography>
                  {task.dueDate && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </Typography>
                  )}
                  {task.priority !== undefined && task.priority !== null && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Priority: {task.priority}
                    </Typography>
                  )}
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    onClick={() => onEditTask(task)}
                      sx={{
                        color: 'text.primary',
                        '&:hover': { color: 'common.black' },
                      }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(task)}
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default TaskList;
