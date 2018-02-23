waitForFinalEvent = (() ->
  timers = {}
  return (callback, ms, uniqueId) ->
    if !uniqueId
      uniqueId = "Don't call this twice without a uniqueId"
    if timers[uniqueId]
      clearTimeout timers[uniqueId]
    timers[uniqueId] = setTimeout(callback, ms)
)()

class CanvasHandlerPromise
  bodyFn: null
  next: null
  root: null
  constructor: (@root, parent, @bodyFn) ->
  flush: () ->
    @root.canvasHandler.flush()
  call: (label) ->
    tgt = @root.promiseLabels[label]
    if tgt?
      @next = tgt
      return @next
    else
      return this
  label: (label) ->
    @root.promiseLabels[label] = this
  workOn: (label) ->
    tgt = @root.promiseLabels[label]
    if tgt?
      return tgt
    else
      return this
  on: (obj, event) ->
    capturedCanvas = null
    @next = new CanvasHandlerPromise @root, this, (c) ->
      capturedCanvas = c
    ($ obj).on event, () =>
      waitForFinalEvent () =>
        if capturedCanvas?
          capturedCanvas.update()
          @next.execute(capturedCanvas)
      , 500, "CHPromiseWindowResize"
    return @next
  paint: (fn) ->
    @next = new CanvasHandlerPromise @root, this, fn
    return @next
  execute: (c) ->
    if not c?
      c = @root?.canvasHandler?.canvas
    if @bodyFn?
      if @bodyFn.paint?
        @bodyFn.paint c
      else
        @bodyFn c
    @next?.execute c
      
module.exports = CanvasHandlerPromise