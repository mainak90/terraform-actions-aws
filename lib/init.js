const core = require("@actions/core");
const path = require("path");
const exec = require('@actions/exec');


async function init() {
    try {
        const version = core.getInput("terraform_version");
        const versionsSet = version.split(".");
        const majorVer = (versionsSet[0] = "0") ? versionsSet[1] : versionsSet[0];
        const bucket = core.getInput("bucket")
        const prefix = core.getInput("stateprefix")
        const region = core.getInput("aws_region")
        core.info(`Changing directories to working directory`)
        const maincmd = `terraform${majorVer}`
        const args = [`init`, `-force-copy`, `-backend-config`, `region=${region}`, `-backend-config`, `bucket=${bucket}`, `-backend-config`, `key=${prefix}`]
        const versionargs = ['-version']
        process.chdir(path.join(process.cwd(), core.getInput("working-directory")))
        core.info(`Starting terraform init with command ${maincmd} ${args}`);
        core.info(`Getting terraform version ${maincmd} ${versionargs}`);
        core.startGroup(`Terraform init`);
        await exec.exec(maincmd, args);
        await exec.exec(maincmd, versionargs);
        core.endGroup();
    } catch (err) {
        core.error(err);
        throw err;
    }
}

module.exports = init;


