window.require = (file) ->
  document.write "<script type='text/javascript' src='http://locohost:4567/javascripts/#{file}'><\/script>"
