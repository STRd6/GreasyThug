task :default => [:build]

task :build do
  puts `rm GreasyThug.zip`
  puts `staticmatic build .`
  puts `zip -r GreasyThug.zip site`
end
