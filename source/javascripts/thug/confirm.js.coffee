#= require lib/jquery-ui-1.8.17.custom.min

#= require lib/namespace

namespace "Thug", (Thug) ->
  Thug.Confirm = (I={}) ->
    Object.reverseMerge I,
      cssScope: "clean_thug"
      title: "Confirmation Dialog"
      text: "Confirm?"
      theme: "darkness"
      buttons:
        Ok: ->
          I.confirm?()
          $(this).dialog('close')
        Cancel: ->
          I.cancel?()
          $(this).dialog('close')

    self = $ "<div>"
      class: "content"

    self.text I.text

    self.prepend $("<span>",
      class: "ui-icon ui-icon-alert"
      css:
        float: "left"
        margin: "0 7px 20px 0"
    )

    self.dialog
      title: I.title
      autoOpen: false
      resizable: false
      width: 400
      minHeight: null
      modal: true #TODO Fix css issues preventing this
      buttons: I.buttons

    # Adjust dialog div for css scoping and theming
    self.parent().addClass(I.cssScope).addClass(I.theme)

    self.dialog('open')

    return self
