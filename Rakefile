require 'rubygems'
require 'jslint/tasks'
JSLint.config_path = "config/jslint.yml"

task :default => [:build]

task :build do
  puts `rm GreasyThug.zip`
  puts `staticmatic build .`
  puts `zip -r GreasyThug.zip site`
end
