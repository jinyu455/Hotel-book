const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('智慧出行酒店预订平台后端服务已启动');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});