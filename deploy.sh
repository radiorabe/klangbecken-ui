#!/usr/bin/env sh

# abort on errors
set -e

# install deps
npm install

# build
npm run build

# copy files
scp -r dist/index.html dist/favicon.ico dist/js dist/css dist/fonts dist/img root@vm-0016.vm-admin.int.rabe.ch:/var/www/html/
