#!/bin/sh

setup_git() {
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"
}

commit_website_files() {
  git checkout gh-pages
  if [ -z "$TRAVIS_BUILD_NUMBER" ]
    then
    TRAVIS_BUILD_NUMBER="temp"
  fi
  mkdir coverage_reports/$TRAVIS_BUILD_NUMBER
  cp -r coverage/* coverage_reports/$TRAVIS_BUILD_NUMBER/
  git add coverage_reports/.
  git commit --message "Travis build: $TRAVIS_BUILD_NUMBER"
}

upload_files() {
  git remote add origin https:/${GH_TOKEN}/@github.com/bazile-clyde/CabX.git > /dev/null 2>&1
  git push --quiet --set-upstream origin gh-pages 
}

setup_git
commit_website_files
upload_files
