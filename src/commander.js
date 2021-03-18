const shell = require('child_process');

const Commander = (baseCommand)=>{
    return {
        executeCommand : (args = [])=> {
            return new Promise ((resolve,reject)=>{
                shell.execFile(baseCommand,args,(err,output)=>{
                    if (err) {
                        reject(err)
                    } else {
                        resolve(output);
                    }
                })
            });
        }
    }
}

module.exports = {
    Commander
}