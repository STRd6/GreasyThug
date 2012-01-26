require 'rubygems'

task :default => [:build]

task :build do
  puts `rm GreasyThug.zip`
  puts `middleman build`
  puts `zip -r GreasyThug.zip build`
end
