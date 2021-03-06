#!/bin/bash

# Enable shell debugging.
set -x

# update git
git pull

# update tools-basis via git
git submodule update --init --recursive

# update npm
npm install

# update bower
./node_modules/bower/bin/bower install

# compile less
./node_modules/less/bin/lessc less/screen.less css/screen.css

forever restart `pwd`
