const PORT = 8000;
const express = require('express');
const app = express();
const cors = require('cors');
const { bind_routes_to_controller } = require('./src/router');
const serverless = require('serverless-http');

const { youtube_app } = bind_routes_to_controller({
    youtube_app: express.Router(),
});
app.use(cors());
app.use('/youtube-video', youtube_app);
app.get('/', (req, res) => res.send('THIS ROUTE WORKS SERVER IS UP'));

if (process.env.isLocal)
    [
        app.listen(PORT, () => {
            console.log('SERVER IS UP AND LISTENING TO PORT ' + PORT);
        }),
    ];

module.exports = { handler: serverless(app) };
