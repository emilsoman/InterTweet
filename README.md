InterTweet
==========

A tiny little app that parses live twitter stream and creates a visualization of users using a force directed graph.

## Example

App is configured with the filter "#rubyfriends #gcrc14"

When a @rubyuser1 tweets "#rubyfriends with @rubyuser2 and @rubyuser3 at #gcrc14",
the server picks it up, pushes the message to the browser, and the browser creates 3 nodes :

1. rubyuser1
2. rubyuser2
3. rubyuser3

and 2 links are drawn :

1. rubyuser1 ===> rubyuser2
2. rubyuser1 ===> rubyuser3

## Requirements

Ruby 2.0

## Usage

1. Clone the repo
2. cd <clone_dir>
3. `bundle install`
4. Update `twitter_config.rb` with configs
5. `bundle exec rackup`
6. Point your browser at `localhost:9292`
