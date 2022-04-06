const { exec } = require("child_process");
const inquirer = require("inquirer");

inquirer
  .prompt([
    /* Pass your questions in here */
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
    // Use user feedback for... whatever!!

    exec(
      `npm version --no-git-tag-version ${changeType}`,
      (error, stdout, stderr) => {
        if (error !== null) {
          //run npm run build command here

          exec("npm pkg get version", (error, stdout, stderr) => {
            if (error !== null) {
              exec(
                `git commit -m 'chore: Build for v${stdout}'`,
                (error, stdout, stderr) => {
                  if (error !== null) {
                    const tagName = `designsystem@v${stdout}`;

                    exec(
                      `git tag ${tagName} && git push origin ${tagName}`,
                      (error, stdout, stderr) => {
                        if (error !== null) {
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
