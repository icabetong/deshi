const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/requests', (request, response) => {
    console.log('Got body: ', request.body);
    return response.sendStatus(200);
})

const port = 5000;
app.listen(port, () => {
    console.log(`Server is listening to port ${port}`)
})