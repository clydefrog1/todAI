import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Filter state
  filter: {
    status: 'all', // 'all', 'todo', 'in-progress', 'done'
    searchQuery: '',
  },
  // Sort state
  sort: {
    field: 'createdAt', // 'createdAt', 'title', 'status'
    order: 'desc', // 'asc', 'desc'
  },
  // View state
  view: 'list', // 'list', 'board', 'grid'
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setStatusFilter: (state, action) => {
      state.filter.status = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.filter.searchQuery = action.payload;
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
    setView: (state, action) => {
      state.view = action.payload;
    },
    resetFilters: (state) => {
      state.filter = initialState.filter;
      state.sort = initialState.sort;
    },
  },
});

export const {
  setStatusFilter,
  setSearchQuery,
  setSortField,
  setSortOrder,
  toggleSortOrder,
  setView,
  resetFilters,
} = taskSlice.actions;

// Selectors
export const selectFilter = (state) => state.tasks.filter;
export const selectSort = (state) => state.tasks.sort;
export const selectView = (state) => state.tasks.view;

export default taskSlice.reducer;
