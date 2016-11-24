---
layout: post
title: 'How to create a new post'
featured_image: ''
comments: false
tags:
summary: ' Summary Here'
---

## using a shell script

```sh
function new_post(){
    cd _posts
    SLUGIFIED="$(echo -n "$1" | sed -e 's/[^[:alnum:]]/-/g' | tr -s '-' | tr A-Z a-z)"
    SLUG=$(date +"%Y-%m-d"-SLUGIFIED.md)
    echo -e "---\nlayout: post\ntitle: '$1'\nfeatured_image: ''\ncomments: false\ntags: \nsummary: 'Summary Here' \n---\n\n# Be Brilliant" > $SLUG
    echo $SLUG
    cd ../
    jekyll serve -w
}
```