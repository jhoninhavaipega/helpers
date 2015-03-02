class window.Sequence

  @add = (name, total, format, path='', start=1) ->
    sequence = []
    i = start

    while i <= total
      sequence.push "#{path}#{name}" + i + ".#{format}"
      i++

    sequence

  constructor: (config) ->
    @FPS = config.FPS || 24
    @config = config
    @startPoint = 0
    @i = 0
    @frames = @config.images.length
    @element = @config.target
    @nextFrame()
    @isPlaying = false
    @total = if @config.skip then @config.skip * Math.floor(@frames / @config.skip) else @frames - 1

  setStartPoint: (start) ->
    @startPoint = start

  play: (delay) ->
    unless @isPlaying
      self = @
      @isPlaying = true
      delay = 0  unless delay
      setTimeout (->
        self.currentInterval = setInterval(->
          self.nextFrame()
          return
        , 1000 / self.FPS)
        return
      ), delay * 1000

  nextFrame: ->
    @element.attr "src", @config.path + @config.images[@i]

    if @i is @total
      @complete()
      @i = @startPoint
      clearInterval @currentInterval unless @config.loop

    @i += if @config.skip then @config.skip else 1

  pause: ->
    if @isPlaying
      @isPlaying = false
      clearInterval @currentInterval

  complete: ->
    @config.complete()  if @config.complete
