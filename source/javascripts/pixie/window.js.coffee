#= require lib/jquery-ui-1.8.17.custom.min

#= require lib/namespace

namespace "Pixie", (Pixie) ->
  Pixie.Window = (I={}) ->
    Object.reverseMerge I,
      cssScope: "clean_thug"
      theme: "darkness"

    self = $ """
      <div class=window>
        <div class=content/>
      </div>
    """

    self.dialog
      title: I.title
      autoOpen: false
      resizable: false
      width: "auto"

    # Wrap dialog div for css scoping and theming
    self.parent().wrap("<div class='#{I.cssScope} #{I.theme}' />")

    return self
