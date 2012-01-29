#= require lib/codemirror2/codemirror
#= require lib/codemirror2/coffeescript

#= require lib/coffee-script

#= require ./history

namespace "Pixie", (Pixie) ->
  DEFAULTS =
    evalContext: eval
    maxHistoryLength: 20

  Pixie.Console = (options) ->
    self = $ """
      <div class=console>
        <div class=actions/>
        <textarea/>
        <pre class=output/>
      </div>
    """

    config = Object.extend {}, DEFAULTS, options

    {evalContext, maxHistoryLength} = config

    pendingCommand = ""

    history = Pixie.History
      localPersistenceKey: "pixie_console_command_history"

    prev = ->
      if command = history.previous()
        self.val(command)
      # Remain on last command when at the end of history

    next = ->
      if command = history.next()
        self.val(command)
      else
        # Exausted history buffer, replace pending command
        self.val(pendingCommand)

    record = (command) ->
      history.push command

    print = (message) ->
      # Prevent the hilarity that is appending whole dom elements to the output
      # TODO: Maybe do a fancier printout than just standard toString
      message = message.toString() if message?.toString?

      output.text(message)

    run = ->
      return unless command = self.val()

      #TODO: Parse and process special commands

      try
        compiledCommand = CoffeeScript.compile command, bare: on

        result = evalContext(compiledCommand)

        self.val("")
      catch error
        result = error.message

      record command
      print result

      return result

    actions =
      prev:
        perform: prev
      next:
        perform: next
      run:
        perform: run

    input = self.find "textarea"

    lang = "coffeescript"

    editor = null

    keyBindings =
      "Shift+Enter": run
      "PageUp": prev
      "PageDown": next

    keepState = true

    for binding, handler of keyBindings
      do (handler) ->
        keyBindings[binding] = ->
          # Don't set the state of the pending command
          # when doing special key commands
          keepState = false

          handler()

    editor = new CodeMirror.fromTextArea input.get(0),
      autoMatchParens: true
      # height: "100%"
      lineNumbers: true
      tabMode: "shift"
      textWrapping: false
      extraKeys: keyBindings
      onKeyEvent: (e) ->
        if e.type == "keyup"
          pendingCommand = self.val() if keepState

          # Every keydown triggers a key up, reset keepState
          keepState = true

          return undefined

    output = self.find(".output")

    actionBar = self.find(".actions")

    Object.extend self,
      val: (newVal) ->
        if newVal?
          editor.setCode(newVal)
        else
          editor.getCode()

      addAction: (action) ->
        {name} = action

        titleText = name.capitalize()

        perform = () ->
          action.perform(self)

        actionElement = $ "<button />",
          text: titleText
          title: titleText
        .bind "mousedown touchstart", (e) ->
          perform() unless $(this).attr('disabled')
        .button()

        return actionElement.appendTo(actionBar)

    for key, action of actions
      action.name = key

      self.addAction(action)

    return self
