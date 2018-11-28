#!/bin/sh

setup_git() {
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"
}

commit_website_files() {
  mkdir -p "reports" 
  if [ -z "$TRAVIS_BUILD_NUMBER" ]
    then
    TRAVIS_BUILD_NUMBER="temp"
  fi
  mkdir -p reports/${TRAVIS_BUILD_NUMBER}
  mkdir -p reports/${TRAVIS_BUILD_NUMBER}/coverage
  cp -r coverage/* reports/${TRAVIS_BUILD_NUMBER}/coverage/
  cp report_unittest.txt reports/${TRAVIS_BUILD_NUMBER}/report_unittest.txt
  cp report_enslint.txt reports/${TRAVIS_BUILD_NUMBER}/report_enslint.txt
  cp report_coverage.txt reports/${TRAVIS_BUILD_NUMBER}/report_coverage.txt
  git add -- ./reports
  git commit --message "Travis build: $TRAVIS_BUILD_NUMBER [ci skip] skip travis [skip travis-ci]"
}

upload_files() {
  git remote add master https://${GH_TOKEN}@github.com/bazile-clyde/CabX.git > /dev/null 2>&1
  git push --quiet 
}

setup_git
commit_website_files
upload_files
