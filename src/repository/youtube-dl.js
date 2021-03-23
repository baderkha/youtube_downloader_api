const { Commander } = require('../util/commander');

const DOWNLOAD_PATH = '/tmp/youtube-dl-api';

const youtube_dl_repo = (program) => {
    return {
        generate_url_for_video_id: (id) => {
            return `https://www.youtube.com/watch?v=${id}`;
        },
        get_file_name_for_download_by_format_id: (format_id, video_link) => {
            return program
                .executeCommand([
                    '-f',
                    format_id,
                    '--get-filename',
                    '-o',
                    `%(title)s-%(format_id)s-%(upload_date)s-%(id)s.%(ext)s`,
                    `${video_link}`,
                ])
                .then((response) => DOWNLOAD_PATH + '/' + response.split('\n')[0]);
        },
        get_video_formats_by_video_link: (video_link) => {
            return program.executeCommand(['--dump-json', video_link]).then((response) => {
                let res = JSON.parse(response);
                return res.formats.map((data) => {
                    return {
                        ...data,
                        filesize: data.filesize
                            ? (data.filesize / (1024 * 1024)).toFixed(2)
                            : 'unknown',
                    };
                });
            });
        },
        get_video_info_by_link: (video_link) => {
            return program.executeCommand(['--dump-json', video_link]).then((response) => {
                let res = JSON.parse(response);
                return {
                    uploader: res.uploader,
                    uploader_id: res.uploader_id,
                    title: res.title,
                    thumnail_url: res.thumbnails.pop().url,
                    date_uploaded: res.upload_date,
                    description: res.description,
                    duration_seconds: `${res.duration}`,
                    duration_minutes: Math.round(res.duration / 60).toFixed(2),
                    views: res.view_count,
                    likes: res.like_count,
                    dislikes: res.dislike_count,
                    rating: res.average_rating,
                };
            });
        },
        download_video_by_format_id: (format_id, video_link) => {
            return program.executeCommand([
                '-f',
                format_id,
                video_link,
                '--output',
                `${DOWNLOAD_PATH}/%(title)s-%(format_id)s-%(upload_date)s-%(id)s.%(ext)s`,
            ]);
        },
        get_thumbnail_by_video_link: (video_link) => {
            return program.executeCommand(['--get-thumbnail', video_link]).then((url) => ({ url }));
        },
    };
};


module.exports = {
    youtube_dl: youtube_dl_repo,
};
