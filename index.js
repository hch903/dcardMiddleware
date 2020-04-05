const express = require('express');
const dcardMiddleware = require('./middleware');
let app = express();

app.use(dcardMiddleware);

app.get('/', (req, res) => {
    res.send('hello world');
});
app.listen(3000, () => {
    console.log('app is running on 3000');
})
