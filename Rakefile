require 'rubygems'

require 'fileutils'
include FileUtils

task :default => [:build]

task :build do
  # Remove any previously built zip
  rm 'GreasyThug.zip', :force => true

  # Remove all but .git from build directory
  rm_r Dir.glob("build/*")

  # Build static assets
  puts %x(middleman build)

  # Copy over CNAME file for gh-pages
  cp "source/CNAME", "build/CNAME"

  # Zip Chrome Extension
  puts %x(zip -r GreasyThug.zip build)
end
