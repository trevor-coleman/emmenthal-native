#!/bin/zsh

if [ $# -eq 0 ]
  then
    echo "Provide commit message"
    exit 1
fi

if [ $# -gt 1 ]
  then
    echo "Too many arguments"
    exit 1
fi

if [ -z "$1" ]
  then
    echo "Commit message cannot be empty"
    exit 1
fi

expo build:web

start_dir=$PWD;
cp -r ./web-build/* ../emmenthal-native-deploy
cd ../emmenthal-native-deploy
git add -A
git commit -m "$1"
git push

cd $start_dir;

