const S3 = require('aws-sdk').S3;
const s3 = new S3();
const fs = require('fs');

const s3_repo = (bucket_name) => {
    return {
        upload_file: (file_to_upload, s3_path = '') => {
            return new Promise((resolve, reject) => {
                fs.readFile(file_to_upload, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        s3.putObject(
                            {
                                Bucket: bucket_name,
                                Body: data,
                                Key: s3_path ? s3_path : file_to_upload,
                            },
                            (err, data) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(data);
                                }
                            }
                        );
                    }
                });
            });
        },
        get_download_link_for_file: (file_name_w_prefix, expiry_time_seconds = undefined) => {
            return s3
                .getSignedUrlPromise('getObject', {
                    Bucket: bucket_name,
                    Key: file_name_w_prefix,
                    Expires: expiry_time_seconds,
                })
                .then((url) => {
                    return {
                        url,
                    };
                });
        },
        check_file_exists: (file_name_w_prefix) => {
            return s3
                .headObject({
                    Bucket: bucket_name,
                    Key: file_name_w_prefix,
                })
                .promise()
                .then(() => true)
                .catch(() => false);
        },
    };
};

module.exports = {
    s3_repo,
};
