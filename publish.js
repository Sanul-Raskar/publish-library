const { exec } = require("child_process");
const inquirer = require("inquirer");

inquirer
  .prompt([
    {
      type: "list",
      name: "changeType",
      message: "Type of change",
      choices: [
        "major",
        "minor",
        "patch",
        "premajor",
        "preminor",
        "prepatch",
        "prerelease",
      ],
    },
  ])
  .then(({ changeType }) => {
    exec(
      `npm version --no-git-tag-version ${changeType} && npm pkg get version`,
      (error, stdout, stderr) => {
        if (error === null) {
          exec("npm run build", (error, stdout, stderr) => {
            if (error === null) {
              const tagName = `designsystem@v${stdout.replaceAll('"', "")}`;
              exec(
                `git add lib/* && git commit -m 'chore: Build for v${stdout}'`,
                (error, stdout, stderr) => {
                  if (error === null) {
                    exec(
                      `git tag ${tagName} && git push origin ${tagName} && git checkout ${tagName}`,
                      (error, stdout, stderr) => {
                        if (error === null) {
                          //publish the tag to npm registry
                        }
                      }
                    );
                  }
                }
              );
            }
          });
        }
      }
    );
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
