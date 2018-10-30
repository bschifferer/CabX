#!/bin/sh

setup_git() {
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"
}

commit_website_files() {
  git checkout coverage_reports
  mkdir -p "coverage_reports" 
  if [ -z "$TRAVIS_BUILD_NUMBER" ]
    then
    TRAVIS_BUILD_NUMBER="temp"
  fi
  mkdir coverage_reports/$TRAVIS_BUILD_NUMBER
  cp -r coverage/* coverage_reports/$TRAVIS_BUILD_NUMBER/
  git add coverage_reports
  git commit --message "Travis build: $TRAVIS_BUILD_NUMBER"
}

upload_files() {
  git remote add origin https://${GH_TOKEN}@github.com/bazile-clyde/CabX.git > /dev/null 2>&1
  git push --quiet --set-upstream origin coverage_reports 
}

setup_git
commit_website_files
upload_files
