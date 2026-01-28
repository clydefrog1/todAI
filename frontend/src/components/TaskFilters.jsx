import {
  Box,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useDispatch, useSelector } from 'react-redux';
import {
  setStatusFilter,
  setSearchQuery,
  setProjectFilter,
  setPriorityFilter,
  setSortField,
  toggleSortOrder,
  selectFilter,
  selectSort,
} from '../store/slices/taskSlice';
import { PROJECT_OPTIONS, PROJECT_LABELS } from '../constants/projects';

function TaskFilters() {
  const dispatch = useDispatch();
  const filter = useSelector(selectFilter);
  const sort = useSelector(selectSort);

  const handleStatusChange = (event, newStatus) => {
    if (newStatus !== null) {
      dispatch(setStatusFilter(newStatus));
    }
  };

  const handleSearchChange = (event) => {
    dispatch(setSearchQuery(event.target.value));
  };

  const handleSortFieldChange = (event) => {
    dispatch(setSortField(event.target.value));
  };

  const handleProjectChange = (event) => {
    dispatch(setProjectFilter(event.target.value));
  };

  const handlePriorityChange = (event) => {
    dispatch(setPriorityFilter(event.target.value));
  };

  const handleToggleSortOrder = () => {
    dispatch(toggleSortOrder());
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        alignItems: { xs: 'stretch', md: 'center' },
        flexWrap: 'wrap',
      }}
    >
      {/* Search */}
      <TextField
        placeholder="Search tasks..."
        value={filter.searchQuery}
        onChange={handleSearchChange}
        size="small"
        sx={{ minWidth: 200, flexGrow: 1, maxWidth: { md: 300 } }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* Status Filter */}
      <ToggleButtonGroup
        value={filter.status}
        exclusive
        onChange={handleStatusChange}
        size="small"
        sx={{
          '& .MuiToggleButton-root': {
            textTransform: 'none',
            px: 2,
          },
        }}
      >
        <ToggleButton value="all">All</ToggleButton>
        <ToggleButton value="todo">To Do</ToggleButton>
        <ToggleButton value="in-progress">In Progress</ToggleButton>
        <ToggleButton value="done">Done</ToggleButton>
      </ToggleButtonGroup>

      {/* Project Filter */}
      <FormControl size="small" sx={{ minWidth: 130 }}>
        <InputLabel id="project-filter-label">Project</InputLabel>
        <Select
          labelId="project-filter-label"
          value={filter.project}
          onChange={handleProjectChange}
          label="Project"
        >
          <MenuItem value="all">All Projects</MenuItem>
          {PROJECT_OPTIONS.map((project) => (
            <MenuItem key={project} value={project}>
              {PROJECT_LABELS[project]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Priority Filter */}
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel id="priority-filter-label">Priority</InputLabel>
        <Select
          labelId="priority-filter-label"
          value={filter.priority}
          onChange={handlePriorityChange}
          label="Priority"
        >
          <MenuItem value="all">All Priorities</MenuItem>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((p) => (
            <MenuItem key={p} value={p}>
              Priority {p}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Sort Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="sort-field-label">Sort by</InputLabel>
          <Select
            labelId="sort-field-label"
            value={sort.field}
            onChange={handleSortFieldChange}
            label="Sort by"
          >
            <MenuItem value="createdAt">Date Created</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="status">Status</MenuItem>
            <MenuItem value="priority">Priority</MenuItem>
            <MenuItem value="dueDate">Due Date</MenuItem>
          </Select>
        </FormControl>
        <Tooltip title={sort.order === 'asc' ? 'Ascending' : 'Descending'}>
          <IconButton onClick={handleToggleSortOrder} size="small">
            {sort.order === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default TaskFilters;
