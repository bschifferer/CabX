#!/bin/sh

setup_git() {
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"
}

commit_website_files() {
  cp -r coverage/* /tmp/
  cp -r report_unittest.txt /tmp/
  cp -r report_enslint.txt /tmp/
  cp -r cp report_coverage.txt /tmp/
  git stash save --keep-index --include-untracked
  git pull origin coverage_reports
  git checkout -b coverage_reports
  mkdir -p "reports" 
  if [ -z "$TRAVIS_BUILD_NUMBER" ]
    then
    TRAVIS_BUILD_NUMBER="temp"
  fi
  mkdir -p reports/${TRAVIS_BUILD_NUMBER}
  mkdir -p reports/${TRAVIS_BUILD_NUMBER}/coverage
  cp -r /tmp/coverage/* reports/${TRAVIS_BUILD_NUMBER}/coverage/
  cp /tmp/report_unittest.txt reports/${TRAVIS_BUILD_NUMBER}/report_unittest.txt
  cp /tmp/report_enslint.txt reports/${TRAVIS_BUILD_NUMBER}/report_enslint.txt
  cp /tmp/report_coverage.txt reports/${TRAVIS_BUILD_NUMBER}/report_coverage.txt
  git add -- ./reports
  git commit --message "Travis build: $TRAVIS_BUILD_NUMBER [ci skip]"
}

upload_files() {
  git remote add origin-pages https://${GH_TOKEN}@github.com/bazile-clyde/CabX.git > /dev/null 2>&1
  git push --quiet --set-upstream origin-pages coverage_reports 
}

setup_git
commit_website_files
upload_files
