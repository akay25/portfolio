#!/bin/bash

# Run install
yarn

# Run build
yarn build

# Copy dist folder to /tmp
cp -r dist /tmp/dist

# Change to /tmp directory
cd /tmp/dist

# Init git and push to main branch
git init
git add .
git commit -m "Deploy to GitHub Pages"
git branch -M master
git remote add origin git@github.com:akay25/akay25.github.io.git
git push -f --set-upstream origin master

# Clean up
cd ..
rm -rf dist