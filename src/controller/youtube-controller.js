const { bad_response } = require('../util/api');
const {uuid} = require('uuidv4');

/**
 * @param {} youtube_dl_repo 
 */
const youtube_controller = (youtube_dl_repo) => {
    return {
        /**
         * fetch the formats for a video
         * @param {Express.Request} req
         * @param {Express.Response} res
         */
        get_formats: async (req, res) => {
            const video_link = youtube_dl_repo.generate_url_for_video_id(req.params.id);

            const youtube_formats = await youtube_dl_repo
                .get_video_formats_by_video_link(video_link)
                .catch((err) => bad_response(404, 'could not get format information about video'+err));

            if (youtube_formats.isError) {
                return res.status(404).send(youtube_formats);
            }

            res.json(youtube_formats);
        },
        /**
         * Download a youtube video
         * @param {Express.Request} req
         * @param {Express.Response} res
         */
        download_video: async (req, res) => {
            const video_link = youtube_dl_repo.generate_url_for_video_id(req.params.id);
            const format_id = req.query.format_id;

            // guard check format id
            if (!format_id) {
                res.status(400).send(bad_response(400, 'no format id provided'));
                return;
            }

            const file_prefix = uuid();
            const file_name = await youtube_dl_repo
                .get_file_name_for_download_by_format_id(format_id, video_link, file_prefix)
                .catch((err) => err);

            // guard check file name
            if (file_name instanceof Error) {
                res.status(500).send(
                    bad_response(
                        500,
                        `Could not generate a file name on the server side ${file_name}`
                    )
                );
                return;
            }

            await youtube_dl_repo
                .download_video_by_format_id(format_id, video_link, file_prefix)
                .then(() => {
                    res.download(file_name);
                })
                .catch(() => {
                    res.status(500).send(
                        bad_response(500, 'Could not download file , this is an internal issue')
                    );
                });
        },
    };
};

module.exports = {
    youtube_controller,
};
