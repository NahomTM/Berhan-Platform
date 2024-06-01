const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path')
require('dotenv').config()

const seedAdminUser = require('./seed/seed');
const auth = require('./routes/auth');
const verifyToken = require('./routes/verifyToken')
const course = require('./routes/course')
const employee = require('./routes/employee')
const tempCredential = require('./routes/changeTemp')
const fileRouter = require('./routes/fileRouter');
const examRoutes = require("./routes/exam");
const student = require('./routes/student')
const question = require('./routes/question')
const profile = require('./routes/profile')
const result = require('./routes/result')
const deleteUserById = require('./controllers/delete')

const app = express();
const port = 4000;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

console.log("DATABASE_URL:", process.env.DATABASE_URL);
seedAdminUser();
deleteUserById();

app.get('/', (req, res) => {
  res.send('Welcome to the platform!');
  console.log(req);
});

app.use('/auth', auth);
app.use('/access-token', verifyToken)
app.use('/course', course)
app.use('/employee', employee)
app.use('/changeTemp', tempCredential)
app.use("/exam", examRoutes);
app.use("/student", student)
app.use("/question", question)
app.use('/profile', profile)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Use the file router
app.use('/api', fileRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
