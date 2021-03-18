const PORT = 8080;
const express = require('express');
const app = express();
const { bindRoutesToControllers } = require('./src/router');



// youtube routes 
const {youtube_app} = bindRoutesToControllers({
    youtube_app : express.Router()
})
app.use('/youtube-video',youtube_app);

app.listen(PORT, () => {
    console.log('SERVER IS UP AND LISTENING TO PORT ' + PORT);
});
