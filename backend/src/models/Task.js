import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['todo', 'in-progress', 'done'],
        message: 'Status must be one of: todo, in-progress, done',
      },
      default: 'todo',
    },
    priority: {
      type: Number,
      min: [1, 'Priority must be at least 1'],
      max: [9, 'Priority must be at most 9'],
      validate: {
        validator: (value) =>
          value === undefined || value === null || Number.isInteger(value),
        message: 'Priority must be an integer',
      },
    },
    dueDate: {
      type: Date,
    },
    project: {
      type: String,
      enum: {
        values: ['personal', 'work', 'shopping', 'health', 'finance', 'other'],
        message: 'Project must be one of: personal, work, shopping, health, finance, other',
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;
