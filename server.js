const express = require('express');
const cors = require('cors');
const aiRoutes = require('./routes/aiRoutes');
const integrationRoutes = require('./routes/integrationRoutes');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/ai', aiRoutes);
app.use('/integrations', integrationRoutes);

app.listen(port, () => {
  console.log(`MCP integration server running on port ${port}`);
});
