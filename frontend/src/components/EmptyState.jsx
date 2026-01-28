import { Box, Typography, Button } from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import { grey } from '@mui/material/colors';

function EmptyState({ variant = 'empty', onCreateTask, onClearFilters }) {
  const isNoResults = variant === 'no-results';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
      }}
    >
      <InboxOutlinedIcon
        sx={{
          fontSize: 80,
          color: grey[400],
          mb: 2,
        }}
      />
      <Typography
        variant="h6"
        color="text.secondary"
        textAlign="center"
        gutterBottom
      >
        {isNoResults ? 'No tasks match your filters' : 'No tasks yet'}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        sx={{ mb: 3 }}
      >
        {isNoResults
          ? 'Try adjusting your search or filter criteria'
          : 'Create your first task to get started!'}
      </Typography>
      {isNoResults ? (
        <Button variant="outlined" onClick={onClearFilters}>
          Clear Filters
        </Button>
      ) : (
        <Button variant="contained" onClick={onCreateTask}>
          Create Task
        </Button>
      )}
    </Box>
  );
}

export default EmptyState;
