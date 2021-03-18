const PORT = 8080;
const express = require('express');
const app = express();
const { bind_routes_to_controller } = require('./src/router');
const { youtube_app } = bind_routes_to_controller({
    youtube_app: express.Router(),
});

app.use('/youtube-video', youtube_app);

app.listen(PORT, () => {
    console.log('SERVER IS UP AND LISTENING TO PORT ' + PORT);
});
