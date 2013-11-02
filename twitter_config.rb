TWITTER_CONFIG = lambda do |c|
  c.consumer_key       = ENV['CONSUMER_KEY']
  c.consumer_secret    = ENV['CONSUMER_SECRET']
  c.oauth_token        = ENV['OAUTH_TOKEN']
  c.oauth_token_secret = ENV['OAUTH_TOKEN_SECRET']
end

STREAM_FILTER = ENV['STREAM_FILTER'] || "coffee"
