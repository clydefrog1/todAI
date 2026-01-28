import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
} from '@mui/material';
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from '../store/apiSlice';
import { useSnackbar } from '../context/SnackbarContext';

const initialFormState = {
  title: '',
  description: '',
  status: 'todo',
};

function TaskForm({ open, onClose, task = null }) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const { showSnackbar } = useSnackbar();

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const isEditMode = Boolean(task);
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
  }, [task, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const parseBackendErrors = (errorResponse) => {
    const fieldErrors = {};
    if (errorResponse?.data?.errors) {
      errorResponse.data.errors.forEach((err) => {
        if (err.field) {
          fieldErrors[err.field] = err.message;
        }
      });
    }
    return fieldErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation
    const clientErrors = {};
    if (!formData.title.trim()) {
      clientErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      clientErrors.title = 'Title must be 200 characters or less';
    }
    if (formData.description.length > 2000) {
      clientErrors.description = 'Description must be 2000 characters or less';
    }

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    try {
      if (isEditMode) {
        await updateTask({ id: task.id, ...formData }).unwrap();
        showSnackbar('Task updated successfully', 'success');
      } else {
        await createTask(formData).unwrap();
        showSnackbar('Task created successfully', 'success');
      }
      onClose();
    } catch (error) {
      const backendErrors = parseBackendErrors(error);
      if (Object.keys(backendErrors).length > 0) {
        setErrors(backendErrors);
      } else {
        showSnackbar(
          error?.data?.message || 'An error occurred. Please try again.',
          'error'
        );
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEditMode ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleChange}
              error={Boolean(errors.title)}
              helperText={errors.title || `${formData.title.length}/200`}
              fullWidth
              required
              autoFocus
              inputProps={{ maxLength: 200 }}
            />
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              error={Boolean(errors.description)}
              helperText={
                errors.description || `${formData.description.length}/2000`
              }
              fullWidth
              multiline
              rows={4}
              inputProps={{ maxLength: 2000 }}
            />
            <FormControl fullWidth error={Boolean(errors.status)}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="todo">To Do</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="done">Done</MenuItem>
              </Select>
              {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default TaskForm;
