#= require lib/namespace

#= require ./persistence

namespace "Thug", (Thug) ->
  Thug.History = (I={}, self={}) ->
    Object.reverseMerge I,
      maxHistory: 50

    if I.localPersistenceKey
      if data = Thug.Persistence.Local.get(I.localPersistenceKey)
        I.maxHistory = data.maxHistory if data.maxHistory

        {commands} = data

    commands ||= []

    index = commands.length

    Object.extend self,
      push: (command) ->
        commands.push command unless command == commands.last()

        if commands.length > I.maxHistory
          commands.shift()

        Thug.Persistence.Local.set(I.localPersistenceKey, self)

        index = commands.length

      previous: ->
        index = Math.max(index - 1, -1)

        return commands[index]

      next: ->
        index = Math.min(index + 1, commands.length)

        return commands[index]

      toJSON: ->
        commands: commands
        maxHistory: I.maxHistory

    return self
