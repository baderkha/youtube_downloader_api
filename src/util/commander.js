const shell = require('child_process');

/**
 * Safley executes commands with user input without worrying about 
 * command line injection
 * @param {String} baseCommand  the base program you want the shell to use
 */
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