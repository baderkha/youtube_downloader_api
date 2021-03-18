const { Commander } = require('./commander');

const youtube_dl = () => {
    const program = Commander('youtube-dl');
    return {
        generate_url_for_video_id : (id) => {
            return `https://www.youtube.com/watch?v=${id}`
        },
        get_file_name_for_download_by_format_id: (format_id, video_link, file_name = '') => {
            return program
                .executeCommand([
                    '-f',
                    format_id,
                    '--get-filename',
                    '-o',
                    `${file_name}.%(ext)s`,
                    `${video_link}`,
                ])
                .then((response) => response.split('\n')[0]);
        },
        get_video_formats_by_video_link: (video_link) => {
            return program.executeCommand(['-F', video_link]).then((response) => {
                return response
                    .split('\n')
                    .filter((value, i,ar) => i > 2 && i != ar.length - 1)
                    .map((value) => ({
                        format_id: value.split(' ')[0],
                        record: value,
                    }));
            });
        },
        download_video_by_format_id: (format_id, video_link, file_name = '') => {
            return program.executeCommand([
                '-f',
                format_id,
                video_link,
                '--output',
                `${file_name}.%(ext)s`,
            ]);
        },
    };
};


module.exports = {
    youtube_dl
}