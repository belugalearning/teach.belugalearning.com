#!/bin/bash

# Enable shell debugging.
set -x

# update git
git pull

# update tools-basis via bower
bower install git@github.com:belugalearning/tools-basis.git
# compile less
node_modules/less/bin/lessc less/screen.less css/screen.css

forever restart `pwd`
