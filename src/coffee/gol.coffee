dat = require 'dat.gui'
gui = null
life = {}

module.exports = ((() ->
  
  codeInput = null
  codeOutput = null
  window.onUpdateCompiledCode = (code) ->
    if codeOutput?
      codeOutput.update code

  life.speed = 50
      
  life.clear = () ->
    life.map.clear()
  
  life.fill = () ->
  
  life.codeInput = ''
  life.simulate = true
  
  window.onload = () ->
  
    console.log 'Window init dat.gui'
    gui = new dat.GUI()
    gui.add life, 'clear'
    gui.add life, 'randomizeBoard'
    gui.add life, 'fill'
    gui.add life, 'codeInput'
    console.log(gui.__controllers)
    # gui.__controllers[3].domElement.childNodes[0].style.height = '450px'
    
    eNode = $(gui.__controllers[3].domElement)
    pNode = eNode.parent()
    eNode.css 'display', 'none'
    pNode.parent().css 'height', '350px'
    pNode.append '<div id="datgui-code-input"></div>'
    codeInput = new CodeFlask()
    codeInput.run '#datgui-code-input', { language: 'javascript' }
    codeInput.update """
Live: Math.random() > 0.99
Live->Live2: Math.random()>0.99
Live->Live: true
Live2->Live2: true
Dead
    """
    
    gui.add life, 'simulate'
    gui.add life, 'speed', 0, 100
    
    $(document).ready () ->
      setTimeout () ->
        el = $('#datgui-code-input')
        el.css 'width', '100%'
        el.css 'height', '350px'
        el.css 'background', 'white'
        tim = -1
        
        compileCode = () ->
          code = el.text()
          window.golCompileCode code
          console.log code
    
        el.on 'keydown keyup changed', () ->
          clearTimeout tim
          tim = setTimeout () ->
            compileCode()
          , 250
        compileCode()
        life.stepAuto()
      , 500
    
  #  aliveColour = [198, 45, 66, 1]
  aliveColour = [
    [31, 141, 214, 1]
    [233, 50, 45, 1]
    [97, 204, 79, 1]
    [139, 160, 30, 1]
    [160, 91, 30, 1]
    [30, 160, 155, 1]
  ]
  deadColour  = [66, 66, 66, 0.1]

  waitForFinalEvent = (() ->
    timers = {}
    return (callback, ms, uniqueId) ->
      if !uniqueId
        uniqueId = "Don't call this twice without a uniqueId"
      if timers[uniqueId]
        clearTimeout timers[uniqueId]
      timers[uniqueId] = setTimeout(callback, ms)
  )()

  Array.prototype.unique = () ->
    a = @concat()
    for i in [0..a.length-1] by 1
      for j in [i+1..a.length-1] by 1
        if a[i] == a[j]
          a.splice j--, 1
    return a

  escape = (s) -> s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')

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
        isDragging=true

      handleMouseUp = (e) ->
        canvasOffset=c.offset()
        offsetX=canvasOffset.left
        offsetY=canvasOffset.top
        canvasWidth=c.width()
        canvasHeight=c.height()
      
        canMouseX=parseInt(e.clientX-offsetX)
        canMouseY=parseInt(e.clientY-offsetY)
        mouseStartX=0
        mouseStartY=0
        isDragging=false

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
        
        if isDragging
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
  handleCanvas = (props) ->
    h = new CanvasHandler(props)
    window.canvasHandler = h
    return h.ready()
  repaintCanvas = () ->
    window.canvasHandler.flush()

  class GOLMap
    map: null
    mapBuffer: null
    alphaMask: null
    w: 0
    h: 0
    conditioner: null
    initMatrix: () ->
      v = []
      for x in [0..@w] by 1
        v.push []
        for y in [0..@h] by 1
          v[x].push 0
      return v
    constructor: (@w, @h, @conditioner) ->
      @map = @initMatrix()
      @mapBuffer = @initMatrix()
      @alphaMask = @initMatrix()
      map_c_x = @w / 2.0
      map_c_y = @h / 2.0
      f_x = 1.0
      f_y = 3.0
      fi_lower_l = 0.0
      fi_upper_l = 1.0
      fi_upper_rl = 0.9
      fi_lower_rl = 0.0
      map_maxd = Math.sqrt(f_x*map_c_x*map_c_x+f_y*map_c_y*map_c_y+0.1)*0.7
      for x in [0..@w] by 1
        for y in [0..@h] by 1
          fi = 1-( Math.sqrt(f_x*(x-map_c_x)*(x-map_c_x)+f_y*(y-map_c_y)*(y-map_c_y))/map_maxd )
          if fi > fi_upper_rl
            fi = fi_upper_l
          if fi < fi_lower_rl
            fi = fi_lower_l
          fi = Math.max fi_lower_l, fi
          fi = Math.min fi_upper_l, fi
          # @alphaMask[x][y] = fi
          @alphaMask[x][y] = 1
    clear: () ->
      for x in [0..@w] by 1
        for y in [0..@h] by 1
          @map[x][y] = 0
          @mapBuffer[x][y] = 0
    set: (x, y, name) ->
      if @map[x]?
        if @map[x][y]?
          @map[x][y] = @conditioner.translateStateName name
    drawStructure: (x, y, obj) ->
      for k, v of obj
        k = k.split ","
        @set ((parseInt k[0])+x), ((parseInt k[1])+y), v
    step: (movx, movy) ->
      movx = 0 if not movx?
      movy = 0 if not movy?
      for x in [0..@w] by 1
        for y in [0..@h] by 1
          @mapBuffer[x][y] = @conditioner.step x, y, @map
      for x in [movx..@w-movx] by 1
        for y in [movy..@h-movy] by 1
          @map[x][y] = @mapBuffer[x+movx][y+movy]
    paint: (c) ->
      zoom = 1.5
      field_margin_left = 2
      field_margin_top = 2
      field_w = (c.w*zoom) / @w
      field_h = (c.h*zoom) / @h

      field_w = Math.min field_w, field_h
      field_h = field_w
      totw = field_w * @w
      toth = field_h * @h

      shift_x = c.shiftX + (c.w - totw) / 2.0
      shift_y = c.shiftY + (c.h - toth) / 2.0

      field_rw = field_w - field_margin_left
      field_rh = field_h - field_margin_top
      for x in [0..@w] by 1
        for y in [0..@h] by 1
          c.x.save()
          c.x.translate(x*field_w+shift_x, y*field_h+shift_y)
          rgba = @conditioner.colour @map[x][y]
          rgba[3] *= @alphaMask[x][y]

          c.x.fillStyle = "rgba(" + (rgba.join ',') + ")"
          c.x.fillRect(-field_rw, -field_rh, field_rw, field_rh)
          c.x.restore()


  golUtils = {
    count: (l) ->
      l.length

    rangeCircle: (map, x0, y0, r) ->
      ret = []
      for x in [x0-r..x0+r] by 1
        for y in [y0-r..y0+r] by 1
          if (x-x0)*(x-x0)+(y-y0)*(y-y0) <= r*r
            if map[x]?
              if map[x][y]?
                ret.push map[x][y]
      return ret

    rangeDistStraight: (map, x0, y0, r) ->
      ret = []
      for x in [x0-r..x0+r] by 1
        for y in [y0-r..y0+r] by 1
          if ((x-x0)*(x-x0)+(y-y0)*(y-y0)) == (r*r)
            if map[x]?
              if map[x][y]?
                ret.push map[x][y]
      return ret

    rangeDist: (map, x0, y0, r) ->
      ret = []
      for x in [x0-r..x0+r] by 1
        for y in [y0-r..y0+r] by 1
          d = (x-x0)*(x-x0)+(y-y0)*(y-y0)
          if d >= (r*r) && d < ((r+1)*(r+1))
            if map[x]?
              if map[x][y]?
                ret.push map[x][y]
      return ret

    filter: (l, p) ->
      l.filter p
  }

  compileCodeToConditioner = (code) ->
    revcode = code.split('\n').reverse().join('\n')
    ncode = ""
    defaultDecl = null
    defaultStateDecl = /^([ a-zA-Z0-9\[\]]+?)$/gm
    match = defaultStateDecl.exec revcode
    if match != null
      defaultDecl = match[0]
      code = code + "\n#{defaultDecl}: true\n"
    #else
    #  throw new Error "No default value declaration."
    match = defaultStateDecl.exec revcode
    if match != null
      throw new Error "Multiple default value declarations."
    matchDecl = /^([ a-zA-Z0-9\<\-\>,\[\]]+?)(:(.*))?$/gm
    match = matchDecl.exec code
    varDecls = ""
    while match != null
      if match[1].indexOf("set ") != -1
        spl = (match[1].split(" "))[1]
        varDecls += "var #{spl} = #{match[3]};\n"
      else
        if not match[3]?
          ncode += "#{match[1]}: true\n"
        else
          if match[3].trim() == ""
            ncode += "#{match[1]}: true\n"
          else
            ncode += "#{match[1]}: #{match[3]}\n"
      match = matchDecl.exec code
    matchStatesDecl = /^([ a-zA-Z0-9\<\-\>,\[\]]+?)(:(.*))$/gm
    code = ncode
    statesNames = []
    statesNamesAliases = {}
    match = matchStatesDecl.exec code
    while match != null
      statesNames = statesNames.concat(match[1].split(/->|,/g)).unique()
      match = matchStatesDecl.exec code
    statesNames = statesNames.sort (a, b) ->
      if a.length == b.length
        return b-a
      else
        return b.length-a.length
    if defaultDecl != null
      statesNamesAliases[defaultDecl] = 0
      i = 1
      for alias in statesNames
        if alias != defaultDecl
          statesNamesAliases[alias] = i
          ++i
    else
      i = 0
      for alias in statesNames
        statesNamesAliases[alias] = i
        ++i
    match = matchStatesDecl.exec code
    ncode = ""
    while match != null
      dir = match[1].split("->")
      C = match[3].trim()
      if dir.length == 2
        dir1 = dir[0].split(",")
        dir2 = dir[1].split(",")
        for A in dir1
          for B in dir2
            #ncode += "#{A}->#{B}: #{C}\n"
            ncode += "#{B}: is(#{A}) && (#{C})\n"
      else
        dir1 = dir[0].split(",")
        for A in dir1
          ncode += "#{A}: #{C}\n"
      match = matchStatesDecl.exec code
    code = ncode
    match = matchStatesDecl.exec code
    ncode = ""
    noelse = true
    while match != null
      B = match[3].trim()
      A = match[1].trim()
      if !noelse
        ncode += "else "
      ncode += "if(#{B}) {return (#{A});}\n"
      match = matchStatesDecl.exec code
      noelse = false
    code = ncode
    sufdecl = "return self;"
    prfdecl = ""
    for alias in statesNames
      prfdecl += "var #{alias} = #{statesNamesAliases[alias]};\n"
    prfdecl_decls = """
      var self = map[x][y];
      var get = function(x0, y0) {
        if(map[x0] === undefined) {
          return null;
        }
        if(map[x0][y0] === undefined) {
          return null;
        }
        return map[x0][y0];
      };
      var filterValue = function(t, v) { return t.filter(function(e){return e === v;}); };
      var circle = function(r) { return golUtils.rangeCircle(map,x,y,r); };
      var countCircleValues = function(r, v) { return (filterValue(circle(r),v)).length; };
      var range = function(r) { return golUtils.rangeDist(map,x,y,r); };
      var countRangeValues = function(r, v) { return (filterValue(range(r),v)).length; };
      var rangeStraight = function(r) { return golUtils.rangeDistStraight(map,x,y,r); };
      var countRangeStraightValues = function(r, v) { return (filterValue(rangeStraight(r),v)).length; };
      var is = function(o, value) {
        if(value === undefined) {
          return map[x][y] === o;
        }
        return o === value;
      };
      var $ = function(xr, yr) { return map[xr+x][yr+y]; };
    """
    code_without_decl = prfdecl + "\n" + varDecls + code + sufdecl
    code = prfdecl + prfdecl_decls + "\n" + varDecls + code + sufdecl
    conditioner = {
      colour: (v) ->
        v = v % @states
        [
          aliveColour[v%aliveColour.length][0]
          aliveColour[v%aliveColour.length][1]
          aliveColour[v%aliveColour.length][2]
          aliveColour[v%aliveColour.length][3]
          #Math.min(aliveColour[0], deadColour[0]) + (v/(@states-1))*Math.abs(aliveColour[0] - deadColour[0])
          #Math.min(aliveColour[1], deadColour[1]) + (v/(@states-1))*Math.abs(aliveColour[1] - deadColour[1])
          #Math.min(aliveColour[2], deadColour[2]) + (v/(@states-1))*Math.abs(aliveColour[2] - deadColour[2])
          #Math.min(aliveColour[3], deadColour[3]) + (v/(@states-1))*Math.abs(aliveColour[3] - deadColour[3])
        ]
    }
    conditioner.translateStateName = (name) ->
      if not statesNamesAliases[name]?
        if defaultDecl != null
          return 0
        else
          return 0
      return statesNamesAliases[name]
    conditioner.states = statesNames.length
    code = "(function(x, y, map){\n#{code}})"

    window.onUpdateCompiledCode( code_without_decl )

    console.log code
    fn = eval code
    conditioner.step = fn
    return conditioner


  condNormal = (compileCodeToConditioner """
  set k: countRangeValues(1, Live)
  Live->Dead: k<2
  Live->Dead: k>3
  Live->Live: k == 2 || k == 3
  Dead->Live: k == 3
  Dead
  """
  )

  val = "Live"

  #                80, 50
  life.map = new GOLMap 80, 50, condNormal

  c = handleCanvas({
    id: '#golcanvas'
    w: () -> $(window).width() #$('#golcanvas').width()
    h: () -> $(window).height() #$('#golcanvas').height()
    onDrag: (x, y, c) ->
      c.moveBy (x*80), (y*50)
      c.flush()
  })

  life.randomizeBoardEx = (strength) ->
    box_x_rng = [0, 80]
    box_y_rng = [0, 80]
    prb = Math.random()*50+50
    for j in [0..prb] by 1
      num = Math.random() * strength + 10
      for i in [0..num] by 1
        if Math.random() > 0.5
          x0 = Math.random()*(box_x_rng[1]-box_x_rng[0])+box_x_rng[0]
          y0 = Math.random()*(box_y_rng[1]-box_y_rng[0])+box_y_rng[0]
          x0 = parseInt x0
          y0 = parseInt y0
          life.map.set x0, y0, val
  
  life.randomizeBoard = () ->
    life.randomizeBoardEx(10)
          
  life.step = () ->
    if !life.simulate
      return 0
    s = 0
    life.map.step(s, s)
    c.flush()
    return 1

  life.stepAuto = () ->
    life.step()
    setTimeout () ->
      life.stepAuto()
    , (100-life.speed) * 10
    
  c
  .on(window, 'resize')
  .paint (c) ->
    c.x.fillStyle = 'rgba(0, 45, 66, 0.1)'
    c.x.fillRect(0, 0, c.w, c.height)
  .paint life.map


  window.life = life
  window.golCompileCode = (code) ->
    life.map.conditioner = (compileCodeToConditioner code)
    

  # codeOutput = new CodeFlask()
  # window.codeOutput = codeOutput
  # codeOutput.run '#code-wrapper-out', { language: 'javascript' }

    
)())
