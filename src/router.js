const { youtube_dl:youtube_dl_repo } = require('./repository/youtube-dl');
const {youtube_controller} = require('./controller/youtube-controller')
const yt_controller = youtube_controller(youtube_dl_repo())

const bindRoutesToControllers = ({ youtube_app }) => {
    
    // YOUTUBE ROUTES

    // get formats for a video
    youtube_app.get('/:id/formats', yt_controller.get_formats);
    // downlod video
    youtube_app.get('/:id', yt_controller.download_video);
    
    return  {
        youtube_app
    }
};

module.exports = {
    bindRoutesToControllers
}
