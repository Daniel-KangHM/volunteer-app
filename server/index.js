const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/volunteer', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const VolunteerSchema = new mongoose.Schema({
  name: String,
  vehicleSupport: { type: String, default: 'No' },
  notes: String,
  type: String,
  timeslots: [String],
});

const Volunteer = mongoose.model('Volunteer', VolunteerSchema);

app.post('/api/volunteers', async (req, res) => {
  const { name, vehicleSupport, notes, type, timeslots } = req.body;
  const volunteer = new Volunteer({ name, vehicleSupport, notes, type, timeslots });
  await volunteer.save();
  res.status(201).send(volunteer);
});

app.get('/api/volunteers', async (req, res) => {
  const volunteers = await Volunteer.find();
  res.send(volunteers);
});

// 정적 파일 제공
app.use(express.static(path.join(__dirname, '../client/build')));

// 모든 경로를 클라이언트의 index.html로 전달
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
