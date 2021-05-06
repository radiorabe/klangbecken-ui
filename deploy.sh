#!/usr/bin/env bash

# abort on errors
set -e

PROD_HOST="root@vm-0016.vm-admin.int.rabe.ch"

# are we on the master branch?
if [ "$(git branch --show-current)" != "master" ]
then
    echo "ERROR: We are NOT on the 'master' branch."
    exit 1
fi

# are we clean?
if ! git diff --exit-code --quiet; then
    echo "ERROR: Working directory is NOT clean."
    exit 1
fi

# is there an upstream remote?
if ! git remote | grep --quiet "^upstream$"; then
    echo "ERROR: No 'upstream' remote configured"
    exit 1
fi

# fetch latest version from upstream
if ! git fetch upstream master; then
    echo
    echo "ERROR: cannot fetch current upstream version."
    exit 1
fi

# are we in sync with upstream/master?
if ! git show --no-patch --pretty=format:%D | grep --quiet upstream/master
then
    echo "ERROR: 'master' branch is NOT in sync with 'upstream/master'."
    exit 1
fi

# increment version
OLD_VERSION=$(sed -n 's/^.*"version": "\(.*\)",$/\1/p' package.json)
LAST_DIGIT=$(echo "$OLD_VERSION" | cut -d. -f3)
LAST_DIGIT=$((LAST_DIGIT + 1))
NEW_VERSION=$(echo "$OLD_VERSION" | cut -d. -f1-2)."$LAST_DIGIT"
sed -i "s/\"version\": \"$OLD_VERSION\"/\"version\": \"$NEW_VERSION\"/g" package.json

# clean install deps
echo "#################################"
echo "# Clean install of dependencies #"
echo "#################################"
npm ci

# build
echo
echo "####################"
echo "# Building project #"
echo "####################"
npm run build

# copy files to prod
echo
echo "#####################"
echo "# Transfering files #"
echo "#####################"
scp -r dist/* "$PROD_HOST":"/var/www/html/"

# commit version change, tag release and push to upstream repo
echo
echo "#######################"
echo "# Finalize deployment #"
echo "#######################"
git add package.json
git commit -m "Version bump v$NEW_VERSION"
git tag "v$NEW_VERSION"
git push upstream master --tags

echo
echo "Deployment successful!"
