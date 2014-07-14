var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/okpanda');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));

var Student, Teacher, Schedule, Timeslot;
var Schema = mongoose.Schema;

var studentSchema = new Schema({
  email: String,
  firstName: String,
  lastName: String,
  schedule: { type: Schema.Types.ObjectId, ref: 'Timeslot' }
});

var teacherSchema = new Schema({
  email: String,
  firstName: String,
  lastName: String,
  timeslots: [{ type: Schema.Types.ObjectId, ref: 'Timeslot' }]
  // schedule: { type: Schema.Types.ObjectId, ref: 'Schedule' }
});

var scheduleSchema = new Schema({ // for next 7 days
  tzero: {
    date: Date, // in UTC
    timeslots: [{ type: Schema.Types.ObjectId, ref: 'Timeslot'}],
    confirmed: [{ type: Schema.Types.ObjectId, ref: 'Timeslot' }],
    availability: [{ type: Schema.Types.ObjectId, ref: 'Timeslot' }] // availability for teachers; requests by students
  },
  tplus1: {
    date: Date,
    timeslots: [{ type: Schema.Types.ObjectId, ref: 'Timeslot'}],
    confirmed: [{ type: Schema.Types.ObjectId, ref: 'Timeslot' }],
    availability: [{ type: Schema.Types.ObjectId, ref: 'Timeslot' }]
  },
  tplus2: {
    date: Date,
    timeslots: [{ type: Schema.Types.ObjectId, ref: 'Timeslot'}],
    confirmed: [{ type: Schema.Types.ObjectId, ref: 'Timeslot' }],
    availability: [{ type: Schema.Types.ObjectId, ref: 'Timeslot' }]
  },
  tplus3: {
    date: Date,
    timeslots: [{ type: Schema.Types.ObjectId, ref: 'Timeslot'}],
    confirmed: [{ type: Schema.Types.ObjectId, ref: 'Timeslot' }],
    availability: [{ type: Schema.Types.ObjectId, ref: 'Timeslot' }]
  },
  tplus4: {
    date: Date,
    timeslots: [{ type: Schema.Types.ObjectId, ref: 'Timeslot'}],
    confirmed: [{ type: Schema.Types.ObjectId, ref: 'Timeslot' }],
    availability: [{ type: Schema.Types.ObjectId, ref: 'Timeslot' }]
  },
  tplus5: {
    date: Date,
    timeslots: [{ type: Schema.Types.ObjectId, ref: 'Timeslot'}],
    confirmed: [{ type: Schema.Types.ObjectId, ref: 'Timeslot' }],
    availability: [{ type: Schema.Types.ObjectId, ref: 'Timeslot' }]
  },
  tplus6: {
    date: Date,
    timeslots: [{ type: Schema.Types.ObjectId, ref: 'Timeslot'}],
    confirmed: [{ type: Schema.Types.ObjectId, ref: 'Timeslot' }],
    availability: [{ type: Schema.Types.ObjectId, ref: 'Timeslot' }]
  }
  // teacher: {type: Schema.Types.ObjectId, ref: 'Teacher' }
});

var timeslotSchema = new Schema({
  schedule: {type: Schema.Types.ObjectId, ref: 'Schedule' },
  // start: Date, // datetime, take time
  // end: Date, // datetime, take time
  date: { type: Date },
  start: Number,
  end: Number,
  open: { type: Boolean, default: true },
  requestedBy: [{ type: Schema.Types.ObjectId, ref: 'Student'}],  // student who requested
  confirmed: { type: Boolean, default: false }, // to be confirmed by teacher
  reservedFor: { type: Schema.Types.ObjectId, ref: 'Student', default: null }, // if confirmed,
  length: { type: Number, default: 30 },
  teacher: { type: Schema.Types.ObjectId, ref: 'Teacher' }
});

Student = mongoose.model('Student', studentSchema);
Teacher = mongoose.model('Teacher', teacherSchema);
Schedule = mongoose.model('Schedule', scheduleSchema);
Timeslot = mongoose.model('Timeslot', timeslotSchema);

module.exports = {
  "Student": Student,
  "Teacher": Teacher,
  "Schedule": Schedule,
  "Timeslot": Timeslot
};
