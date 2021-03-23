const { Commander } = require('./util/commander');
const { youtube_dl: youtube_dl_repo } = require('./repository/youtube-dl');
const { youtube_controller } = require('./controller/youtube-controller');
const { s3_repo } = require('./repository/s3-repository');
const yt_controller = youtube_controller(
    youtube_dl_repo(Commander('youtube-dl')),
    s3_repo('ydl-downloads')
);

const bind_routes_to_controller = ({ youtube_app }) => {
    // YOUTUBE ROUTES
    {
        // get formats for a video
        youtube_app.get('/:id/formats', yt_controller.get_formats);
        youtube_app.get('/:id/thumbnails', yt_controller.get_thumbnail);
        // downlod video
        youtube_app.get('/:id', yt_controller.download_video);
        youtube_app.get('/:id/details', yt_controller.get_info);
    }

    return {
        youtube_app,
    };
};

module.exports = {
    bind_routes_to_controller,
};
