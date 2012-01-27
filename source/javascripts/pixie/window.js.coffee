namespace "Pixie", (Pixie) ->
  Pixie.Window = (I={}) ->
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

    return self
