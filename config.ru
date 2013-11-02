require 'em-websocket'
require 'twitter'
#require 'vienna'
require 'sinatra'
require './twitter_config.rb'

#run Vienna::Application.new('client/build')
require './app'
run Sinatra::Application

websocket_thread = Thread.new do
  EM.run do
    @channel = EM::Channel.new
    EM::WebSocket.run(:host => "0.0.0.0", :port => 3000) do |ws|
      ws.onopen do
        sid = @channel.subscribe { |msg| ws.send msg }
        ws.onclose { @channel.unsubscribe sid }
      end
    end
  end
end


streaming_client = Twitter::Streaming::Client.new(&TWITTER_CONFIG)
rest_client = Twitter::REST::Client.new(&TWITTER_CONFIG)

twitter_stream_thread = Thread.new do
streaming_client.filter(:track => STREAM_FILTER) do |tweet|
  from_user = {}
  to_users = []
  user_mentions = tweet.user_mentions.each do |user|
    user_object = rest_client.user(user.screen_name)
    to_users.push({ handle: user.screen_name, profile_image_url: user_object.profile_image_url.to_s })
  end
  from_user = { handle: tweet.user.handle, profile_image_url: tweet.user.profile_image_url }
  @channel.push ({user: from_user, mentions: to_users, tweet: tweet.text}.to_json)
end
end
