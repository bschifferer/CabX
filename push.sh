#!/bin/sh

setup_git() {
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"
}

commit_website_files() {
  git pull origin coverage_reports
  git checkout -b coverage_reports
  mkdir -p "reports" 
  if [ -z "$TRAVIS_BUILD_NUMBER" ]
    then
    TRAVIS_BUILD_NUMBER="temp"
  fi
  mkdir -p reports/${TRAVIS_BUILD_NUMBER}
  mkdir -p reports/${TRAVIS_BUILD_NUMBER}/coverage
  cp -r coverage/* reports/${TRAVIS_BUILD_NUMBER}/coverage/
  cp report_unittest.txt reports/${TRAVIS_BUILD_NUMBER}/
  cp report_enslint.txt reports/${TRAVIS_BUILD_NUMBER}/
  cp report_coverage.txt reports/${TRAVIS_BUILD_NUMBER}/
  git add -- ./reports
  git commit --message "Travis build: $TRAVIS_BUILD_NUMBER"
}

upload_files() {
  git remote add origin-pages https://${GH_TOKEN}@github.com/bazile-clyde/CabX.git > /dev/null 2>&1
  git push --quiet --set-upstream origin-pages coverage_reports 
}

setup_git
commit_website_files
upload_files
