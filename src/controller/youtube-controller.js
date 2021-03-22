const { bad_response } = require('../util/api');
const { uuid } = require('uuidv4');

/**
 * @param {} youtube_dl_repo
 */
const youtube_controller = (youtube_dl_repo, s3_repo) => {
    const handle_download = async ({ file_name, format_id, video_link }, res) => {
        try {
            console.log('Cache miss , downloading from youtube');
            await youtube_dl_repo.download_video_by_format_id(format_id, video_link);
            await s3_repo.upload_file(file_name);
            let data = await s3_repo.get_download_link_for_file(file_name);
            res.send(data);
        } catch (err) {
            res.status(500).send(
                bad_response(
                    500,
                    'Could not Contact youtube servers for download file / or could not contact s3 for upload file, this is an internal error' +
                        err
                )
            );
        }
    };
    const handle_cache_download = async (file_name, res) => {
        console.log('Grabbing file from cache');
        return s3_repo
            .get_download_link_for_file(file_name)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send(
                    bad_response(
                        500,
                        'Could not Generate an s3 presigned url , tis is an internal error' + err
                    )
                );
            });
    };

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
                .catch((err) =>
                    bad_response(404, 'could not get format information about video' + err)
                );

            if (youtube_formats.isError) {
                return res.status(404).send(youtube_formats);
            }

            res.json(youtube_formats);
        },
        get_thumbnail: async (req, res) => {
            const video_link = youtube_dl_repo.generate_url_for_video_id(req.params.id);
            return await youtube_dl_repo
                .get_thumbnail_by_video_link(video_link)
                .then((response) => res.send([response]))
                .catch((err) =>
                    res.status(404).send('could not find a thumnail for this video' + err)
                );
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

            const file_name = await youtube_dl_repo
                .get_file_name_for_download_by_format_id(format_id, video_link)
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

            // download from s3 cache , best case scenario
            if (await s3_repo.check_file_exists(file_name)) {
                return await handle_cache_download(file_name, res);
            }
            return await handle_download({ file_name, format_id, video_link }, res);
        },
    };
};

module.exports = {
    youtube_controller,
};
