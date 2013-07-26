#!/bin/bash

# Enable shell debugging.
set -x

# update git
git pull

# update tools-basis via git
git submodule update --init --recursive
# compile less
lessc less/screen.less css/screen.css

forever restart `pwd`
