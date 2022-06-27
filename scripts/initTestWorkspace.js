/*
#### ########   #######  ##    ## ##       ##     ##  #######   #######   #######  
 ##  ##     ## ##     ## ###   ## ##       ##     ## ##     ## ##     ## ##     ## 
 ##  ##     ## ##     ## ####  ## ##       ##     ##        ##        ##        ## 
 ##  ########  ##     ## ## ## ## ##       ##     ##  #######   #######   #######  
 ##  ##   ##   ##     ## ##  #### ##       ##     ## ##               ##        ## 
 ##  ##    ##  ##     ## ##   ### ##       ##     ## ##        ##     ## ##     ## 
#### ##     ##  #######  ##    ## ########  #######  #########  #######   #######  

 * @author        IronLu233 <lrironsora@gmail.com>
 * @date          2022-06-19 11:06:08
 */
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const { execSync }= require('child_process');
const packageManifest = require('../package.json');

const TEST_WORKSPACE_PATH = packageManifest.testWorkspacePath;
if (fs.existsSync(TEST_WORKSPACE_PATH)) {
    rimraf.sync(TEST_WORKSPACE_PATH);
}

const shouldInitGit = !process.env.UNSET_GIT;

fs.mkdirSync(TEST_WORKSPACE_PATH);
console.log(path.resolve(TEST_WORKSPACE_PATH));
// shouldInitGit && execSync('git init -q', { cwd: TEST_WORKSPACE_PATH });
// execSync('git config user.name "Test User"', { cwd: TEST_WORKSPACE_PATH });
// execSync('git config user.email "test@email.com', { cwd: TEST_WORKSPACE_PATH });
