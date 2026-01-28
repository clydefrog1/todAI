import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // View mode state
  viewMode: 'all', // 'all', 'today', 'upcoming', 'completed'
  // Filter state
  filter: {
    status: 'all', // 'all', 'todo', 'in-progress', 'done'
    searchQuery: '',
    project: 'all', // 'all' or project enum values
    priority: 'all', // 'all' or 1-9
  },
  // Sort state
  sort: {
    field: 'createdAt', // 'createdAt', 'title', 'status', 'priority', 'dueDate'
    order: 'desc', // 'asc', 'desc'
  },
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.filter.status = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.filter.searchQuery = action.payload;
    },
    setProjectFilter: (state, action) => {
      state.filter.project = action.payload;
    },
    setPriorityFilter: (state, action) => {
      state.filter.priority = action.payload;
    },
    setSortField: (state, action) => {
      state.sort.field = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sort.order = action.payload;
    },
    toggleSortOrder: (state) => {
      state.sort.order = state.sort.order === 'asc' ? 'desc' : 'asc';
    },
    resetFilters: (state) => {
      state.viewMode = initialState.viewMode;
      state.filter = initialState.filter;
      state.sort = initialState.sort;
    },
  },
});

export const {
  setViewMode,
  setStatusFilter,
  setSearchQuery,
  setProjectFilter,
  setPriorityFilter,
  setSortField,
  setSortOrder,
  toggleSortOrder,
  resetFilters,
} = taskSlice.actions;

// Selectors
export const selectViewMode = (state) => state.tasks.viewMode;
export const selectFilter = (state) => state.tasks.filter;
export const selectSort = (state) => state.tasks.sort;

export default taskSlice.reducer;
