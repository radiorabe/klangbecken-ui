# klangbecken-ui

This vue.js web client is the user interface app for the [Klangbecken project](https://github.com/radiorabe/klangbecken).

## Project setup
```bash
npm install
```

### Compiles and hot-reloads for development
```bash
npm run serve
```

## Deployment

The deployment script `deploy.sh` automates deploying the code.

_Preparation before deploying for the first time:_
* Make sure, that the `PROD_HOST` variable in the `deploy.sh` script is pointing at your production server.
* Make sure, that you have access to the production server (e.g. SSH publik key authentication).
* Configure a remote repository `upstream` pointing at this upstream repository:
  ```bash
  git remote add upstream git@github.com:radiorabe/klangbecken-ui.git
  ```
* Configure git to automatically fetch tags from `upstream`:
  ```bash
  git config remote.upstream.tagOpt --tags
  ```

_Preparation before deploying_:
* Make sure your code builds correctly and passes continuous integration.
* Test your changes locally.
* Make sure that your working directory is clean, and that you are on the master branch:
  ```bash
  git stash
  git checkout master
  ```
* Bring your code in sync with the latest version from `upstream`:
  ```bash
  git fetch upstream
  git rebase upstream/master
  ```
* Verify that you are indeed in sync with `upstream`:
  ```bash
  git show --no-patch
  ```

_Run the script:_
```bash
./deploy.sh
```
It perfoms the following steps:
- Increment the version number.
- Perform a clean reinstall of all dependencies
- Build the project
- Copy the built files from `dist/` to `/var/www/html/` on the production server
- If everything was successful
  - Commit the new version number
  - Tag the new commit with the new version number
  - Push it to the `upstream` repository.


## Licence
klangbecken-ui is released under the terms of the GNU General Public License. Copyright 2017-2021 Radio RaBe. See `LICENSE` for further information.
