# Prerequisites

## Homebrew
[Homebrew](http://brew.sh/) is a package manager for OSX. It makes installing command line utilities really easy!

Open terminal.app and run: `ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go)"`

Say yes when it prompts you.


## git

[git](http://git-scm.com/) is the source code versioning tool that we use. You can use it though the command line or with something like [SourceTree](http://www.sourcetreeapp.com/) too.

Run: `brew install git`


## GitHub

If you don't have a [GitHub.com](http://github.com) account please create one. Email [Nick](mailto:nc@belugalearning.com) to be added to the Organisation account.

You'll probably also want to generate a ssh key & add it to your GitHub account, this guide will help you: [Generating SSH Keys](https://help.github.com/articles/generating-ssh-keys)


## node.js

[node](http://nodejs.org/) is a server application platform that we use for lots of things.

I'd recommend that you install it using [nvm](https://github.com/creationix/nvm) just follow the instructions to install nvm then come back here.

We predominantly use node v0.8 at the moment. Though this version is subject to constant change. `nvm install 0.8` will install it for you. I'd also recommend adding `nvm use 0.8` to your `~/.bash_profile` too. `cat "nvm install 0.8" >> ~/.bash_profile` will take care of that.


# Setup

Create a folder for your beluga projects `mkdir -p ~/dev/beluga && cd ~/dev/beluga`

Clone this repo into your development folder. `git clone ...`

`cd` into the teach folder

Run the update script `./update`

# Running the project

Run `node index.js --localise`


# Update Server to latest

This script will pull the latest from the git repo for both teach.belugalearning.com & tools-basis

`$ ssh blws@augustus.zubi.me`

`$ cd /usr/local/lib/teach`

`$ ./update.sh`

Enter in the relevant details. Done :)
