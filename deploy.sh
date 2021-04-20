#!/usr/bin/env sh

# abort on errors
set -e

# are we on the master branch?
if [ "$(git branch --show-current)" != "master" ]
then
    echo "ERROR: We are not on the 'master' branch."
    exit 1
fi

# are we clean?
if ! git diff --exit-code --quiet; then
    echo "ERROR: Working directory is NOT clean."
    exit 1
fi

# increment version
OLD_VERSION=$(sed -n 's/.*"version": "\(.*\)",/\1/p' package.json)
LAST_DIGIT=$(echo "$OLD_VERSION" | cut -d. -f3)
LAST_DIGIT=$((LAST_DIGIT + 1))
NEW_VERSION=$(echo "$OLD_VERSION" | cut -d. -f1-2).$LAST_DIGIT
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
scp -r dist/index.html dist/favicon.ico dist/js dist/css dist/fonts dist/img root@vm-0016.vm-admin.int.rabe.ch:/var/www/html/

# commit version change and tag release
git add package.json
git commit -m "Version bump v$NEW_VERSION"
git tag "v$NEW_VERSION"

echo
echo "Deployment successful!"
echo "Push the newly created version tag to the upstream repository with"
echo "    git push --tags upstream master"
