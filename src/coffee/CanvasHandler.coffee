CanvasHandlerPromise = require './CanvasHandlerPromise.coffee'


class CanvasHandler
  canvas: null
  paintQueue: null
  props: null
  flush: () ->
    @canvas.update()
    @paintQueue.execute @canvas
  ready: () -> @paintQueue
  updateCanvas: () ->
    c = $ (@props.id)
    
    isDragging=false
    isRealDrag=false
    lastDownT=-1
    mouseStartX=0
    mouseStartY=0
    
    handleMouseDown = (e) ->
      canvasOffset=c.offset()
      offsetX=canvasOffset.left
      offsetY=canvasOffset.top
      canvasWidth=c.width()
      canvasHeight=c.height()
      
      canMouseX=parseInt(e.clientX-offsetX)
      canMouseY=parseInt(e.clientY-offsetY)
      
      if !isDragging
        mouseStartX=canMouseX
        mouseStartY=canMouseY
        lastDownT=(+ new Date())
        isDragging=true

    handleMouseUp = (e) =>
      canvasOffset=c.offset()
      offsetX=canvasOffset.left
      offsetY=canvasOffset.top
      canvasWidth=c.width()
      canvasHeight=c.height()
    
      canMouseX=parseInt(e.clientX-offsetX)
      canMouseY=parseInt(e.clientY-offsetY)
      mouseStartX=0
      mouseStartY=0
      
      mouseRelX = canMouseX/canvasWidth
      mouseRelY = canMouseY/canvasHeight
      
      mouseXCanvas=canMouseX-@canvas.shiftX
      mouseYCanvas=canMouseY-@canvas.shiftY
      
      if isDragging and (not isRealDrag)
        if @props.onClick
          @props.onClick mouseXCanvas, mouseYCanvas, this
      
      isDragging=false
      lastDownT=-1

    handleMouseOut = (e) ->
      canvasOffset=c.offset()
      offsetX=canvasOffset.left
      offsetY=canvasOffset.top
      canvasWidth=c.width()
      canvasHeight=c.height()
    
      canMouseX=parseInt(e.clientX-offsetX)
      canMouseY=parseInt(e.clientY-offsetY)
      mouseStartX=0
      mouseStartY=0
      
    handleMouseMove = (e) =>
      canvasOffset=c.offset()
      offsetX=canvasOffset.left
      offsetY=canvasOffset.top
      canvasWidth=c.width()
      canvasHeight=c.height()
      
      canMouseX=parseInt(e.clientX-offsetX)
      canMouseY=parseInt(e.clientY-offsetY)
      mouseDeltaX=canMouseX-mouseStartX
      mouseDeltaY=canMouseY-mouseStartY
      
      mouseDeltaRelX = mouseDeltaX/canvasWidth
      mouseDeltaRelY = mouseDeltaY/canvasHeight
      
      mouseDeltaXCanvas=canMouseX-@canvas.shiftX
      mouseDeltaYCanvas=canMouseY-@canvas.shiftY
      
      if @props.onMove
        @props.onMove mouseDeltaXCanvas, mouseDeltaYCanvas, this
      
      isRealDrag = false
      if not isDragging
        isRealDrag = false
      else
        if lastDownT > 0
          if (+ new Date()) - lastDownT > 50
            isRealDrag = true
      
      if isRealDrag
        if @props.onDrag
          @props.onDrag mouseDeltaRelX, mouseDeltaRelY, this
      
    c.mousedown (e) ->
      handleMouseDown e
    c.mousemove (e) ->
      handleMouseMove e
    c.mouseup (e) ->
      handleMouseUp e
    c.mouseout (e) ->
      handleMouseOut e
    
    ctx = c[0].getContext("2d")
    props = @props
    @canvas = {
      x: ctx
      dom: c
      w: 0
      h: 0
      shiftX: 0
      shiftY: 0
      update: () ->
        @w = (props.w())
        @h = (props.h())
        @x.canvas.width = @w
        @x.canvas.height = @h
    }
    @canvas.update()
  
  moveBy: (x, y) ->
    @canvas.shiftX += x
    @canvas.shiftY += y
  
  moveTo: (x, y) ->
    @canvas.shiftX = x
    @canvas.shiftY = y
  
  constructor: (@props) ->
    @paintQueue = new CanvasHandlerPromise {
      canvasHandler: this
      promiseLabels: []
    }, null, () ->
    ($ document).ready () =>
      @updateCanvas()
      @flush()
        
module.exports = CanvasHandler