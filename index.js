const shell = require('child_process');
const express = require('express');
const app = express();
const { uuid } = require('uuidv4');
const PORT = 8080;

app.get('/video-information', (req, res) => {
    const video_link = req.query.video_link;
    if (!video_link) {
        res.status(400).json({
            message: 'no video link found',
        });
        return;
    }
    const cmd = `youtube-dl -F ${video_link}`;
    const cmd_response = shell.execSync(cmd).toString('utf-8');
    const cmd_response_ar = cmd_response.split('\n');
    const cmd_response_ar_clean = cmd_response_ar.filter((value, i) => {
        return i > 2 && i != cmd_response_ar.length - 1;
    });
    const cmd_response_ar_clean_expected = cmd_response_ar_clean.map((value) => {
        const id = value.split(' ')[0];
        return {
            rendition_id: id,
            record: value,
        };
    });
    res.json({
        response: cmd_response_ar_clean_expected,
    });
});

app.get('/download-video', (req, res) => {
    const video_link = req.query.video_link;
    const rendition_id = req.query.rendition_id;
    const file_prefix = uuid();
    if (!video_link || !rendition_id) {
        res.status(400).json({
            message: 'no video link or rendition id included , please retry',
        });
        return;
    }

    const get_filename_cmd = `youtube-dl -f ${rendition_id} --get-filename -o "${file_prefix}.%(ext)s" '${video_link}'`;
    const fileName = shell.execSync(get_filename_cmd).toString('utf-8').split('\n')[0];

    const download_cmd = `youtube-dl -f ${rendition_id} ${video_link} --output "${file_prefix}.%(ext)s"`;
    shell.execSync(download_cmd);

    //res.download(`/Users/ahmad/node-youtube-dl`,fileName);
    res.download(fileName, (err) => {
        res.status(500).send({ message: 'this is a fatal serer error', stack_trace: err.stack });
    });
});

app.listen(PORT, () => {
    console.log('SERVER IS UP AND LISTENING TO PORT ' + PORT);
});
