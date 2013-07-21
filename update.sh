#!/bin/bash

# Enable shell debugging.
set -x

# update git
git pull

# update tools-basis via git
git submodule update --init --recursive
# compile less
node_modules/less/bin/lessc less/screen.less css/screen.css

forever restart `pwd`
