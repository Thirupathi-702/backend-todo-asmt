const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth').router;
const todoRoutes = require('./routes/todos');
const profileRoutes = require('./routes/profile');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/profile', profileRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
