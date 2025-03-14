#!/bin/bash

echo "Select the Git user for this repository:"
echo "1. pappukrs"
echo "2. codeserver111"
echo "3. pappukh"

read -p "Enter your choice (1-3): " choice

case $choice in
  1)
    git config user.name "pappukrs"
    git config user.email "digitalpappu101@gmail.com"
    echo "Git user set to pappukrs."
    ;;
  2)
    git config user.name "user2"
    git config user.email "codeserver111@gmail.com"
    echo "Git user set to user2."
    ;;
  3)
    git config user.name "user3"
    git config user.email "khautomations.pappu@gmail.com"
    echo "Git user set to user3."
    ;;
  *)
    echo "Invalid choice. Exiting."
    exit 1
    ;;
esac

# Display current Git username
echo "Current Git username: $(git config user.name)"
