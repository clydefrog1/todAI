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
  priority: '',
  dueDate: '',
};

const pad2 = (n) => String(n).padStart(2, '0');

const formatDateForInput = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
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
        priority: task.priority ?? '',
        dueDate: formatDateForInput(task.dueDate),
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

    const errs = errorResponse?.data?.errors;
    if (!Array.isArray(errs)) return fieldErrors;

    errs.forEach((err) => {
      if (typeof err === 'string') {
        fieldErrors._global = fieldErrors._global
          ? `${fieldErrors._global}\n${err}`
          : err;
        return;
      }

      if (err && typeof err === 'object' && err.field) {
        fieldErrors[err.field] = err.message || 'Invalid value';
      }
    });

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

    if (formData.priority !== '' && formData.priority !== null) {
      const priorityNumber = Number(formData.priority);
      if (!Number.isInteger(priorityNumber) || priorityNumber < 1 || priorityNumber > 9) {
        clientErrors.priority = 'Priority must be an integer between 1 and 9';
      }
    }

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
    };

    if (formData.priority !== '') {
      payload.priority = Number(formData.priority);
    } else if (isEditMode) {
      payload.priority = null;
    }

    if (formData.dueDate !== '') {
      // Interpret as local date at midnight
      payload.dueDate = new Date(`${formData.dueDate}T00:00:00`).toISOString();
    } else if (isEditMode) {
      payload.dueDate = null;
    }

    try {
      if (isEditMode) {
        await updateTask({ id: task.id, ...payload }).unwrap();
        showSnackbar('Task updated successfully', 'success');
      } else {
        await createTask(payload).unwrap();
        showSnackbar('Task created successfully', 'success');
      }
      onClose();
    } catch (error) {
      const backendErrors = parseBackendErrors(error);
      const { _global, ...fieldLevel } = backendErrors;

      if (Object.keys(fieldLevel).length > 0) {
        setErrors(fieldLevel);
      }

      if (_global) {
        showSnackbar(_global, 'error');
      }

      if (Object.keys(fieldLevel).length === 0 && !_global) {
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
            <TextField
              name="priority"
              label="Priority (19)"
              type="number"
              value={formData.priority}
              onChange={handleChange}
              error={Boolean(errors.priority)}
              helperText={errors.priority || 'Optional'}
              fullWidth
              inputProps={{ min: 1, max: 9, step: 1 }}
            />
            <TextField
              name="dueDate"
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              error={Boolean(errors.dueDate)}
              helperText={errors.dueDate || 'Optional'}
              fullWidth
              InputLabelProps={{ shrink: true }}
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
