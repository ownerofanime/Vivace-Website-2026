const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Vivace 2026 running at http://localhost:${PORT}`);
  });
}

module.exports = app;
