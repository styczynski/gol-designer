class GOLMap
  stepLock: false
  map: null
  metadata: null
  mapBuffer: null
  alphaMask: null
  mousePasteStructure: null
  displayMode: 'normal'
  w: 0
  h: 0
  field_w: 0
  field_h: 0
  lifeObj: null
  hoverListener: null
  ltype: null
  simTime: 0
  lastMouseMovePosX: 0
  lastMouseMovePosY: 0
  hoveredFieldX: 0
  hoveredFieldY: 0
  selectBox: null
  lastMouseMoveC: null
  initMetadataMatrix: () ->
    v = []
    for x in [0..@w] by 1
      v.push []
      for y in [0..@h] by 1
        v[x].push {
          timeChanged: 0
          lastState: 0
        }
    return v
  initMatrix: () ->
    v = []
    for x in [0..@w] by 1
      v.push []
      for y in [0..@h] by 1
        v[x].push 0
    return v
  constructor: (@w, @h, @lifeObj) ->
    @initialize()
  setDisplayMode: (type) ->
    @displayMode = type
  getDisplayMode: () ->
    return @displayMode
  initialize: () ->
    @simTime = 0
    @map = @initMatrix()
    @mapBuffer = @initMatrix()
    @alphaMask = @initMatrix()
    @metadata = @initMetadataMatrix()
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
  reset: () ->
    @initialize()
  saveSession: () ->
    @stepLock = true
    clonedMap = @initMatrix()
    clonedAlphaMask = @initMatrix()
    clonedMetadata = @initMatrix()
    for x in [0..@w] by 1
      for y in [0..@h] by 1
        clonedMetadata[x][y] = {}
        for k, v of @metadata[x][y]
          clonedMetadata[x][y][k] = v
        clonedMap[x][y] = @map[x][y]
        clonedAlphaMask[x][y] = @alphaMask[x][y]
    @stepLock = false
    return {
      map: clonedMap
      metadata: clonedMetadata
      alphaMask: clonedAlphaMask
      ltype: @ltype
    }
  loadSession: (sess) ->
    @stepLock = true
    
    simTime = @simTime
    @initialize()
    @simTime = simTime
    
    if sess.map?
      @map = sess.map
    if sess.metadata?
      @metadata = sess.metadata
    @mapBuffer = @initMatrix()
    if sess.alphaMask?
      @alphaMask = sess.alphaMask
    @ltype = sess.ltype
    
    
    @stepLock = false
    @stepBuf()
  onFieldHover: (fn) ->
    @hoverListener = fn
  clear: () ->
    for x in [0..@w] by 1
      for y in [0..@h] by 1
        @map[x][y] = 0
        @mapBuffer[x][y] = 0
  setValue: (x, y, val) ->
    if @stepLock
      return false
    if @map[x]?
      if @map[x][y]?
        if @map[x][y] != val
          @metadata[x][y].lastState = @map[x][y]
          @metadata[x][y].timeChanged = @simTime
        @map[x][y] = val
  set: (x, y, name) ->
    if @stepLock
      return false
    @setValue x, y, (@lifeObj.lifeTypes[@lifeObj.type].conditioner.translateStateName name)
  drawStructure: (x, y, struct) ->
    if @stepLock
      return false
    for pos, typeName of struct
      pos = pos.split 'x'
      @set ((parseInt pos[0])+x), ((parseInt pos[1])+y), typeName
  stepBuf: () ->
    for x in [0..@w] by 1
      for y in [0..@h] by 1
        @mapBuffer[x][y] = @lifeObj.lifeTypes[@lifeObj.type].conditioner.step x, y, @map
  step: (movx, movy) ->
    if @stepLock
      return false
    ++@simTime
    movx = 0 if not movx?
    movy = 0 if not movy?
    @stepBuf()
    for x in [movx..@w-movx] by 1
      for y in [movy..@h-movy] by 1
        if @map[x][y] != @mapBuffer[x+movx][y+movy]
          @metadata[x][y].lastState = @map[x][y]
          @metadata[x][y].timeChanged = @simTime
        @map[x][y] = @mapBuffer[x+movx][y+movy]
    if @lastMouseMoveC?
      @onMouseMove @lastMouseMovePosX, @lastMouseMovePosY, @lastMouseMoveC
  onMouseMove: (x, y, c) ->
    totw = @field_w * @w
    toth = @field_h * @h
    field_x = Math.ceil((x - (c.canvas.w - totw) / 2.0)/@field_w)
    field_y = Math.ceil((y - (c.canvas.h - toth) / 2.0)/@field_h)
    field_x_abs = (x-1) * @field_w + c.canvas.shiftX + (c.canvas.w - totw) / 2.0
    field_y_abs = (y-1) * @field_h + c.canvas.shiftY + (c.canvas.h - toth) / 2.0
    
    
    @hoveredFieldX = field_x
    @hoveredFieldY = field_y
    
    @lastMouseMovePosX = x
    @lastMouseMovePosY = y
    @lastMouseMoveC = c
    
    # c.canvas.x.fillStyle = 'rgba(0, 45, 66, 0.1)'
    # c.canvas.x.fillRect(0, 0, c.canvas.w, c.canvas.height)
    # @paint(c.canvas)
    c.flush()
    
    if @hoverListener?
      @hoverListener @hoveredFieldX, @hoveredFieldY, field_x_abs, field_y_abs, (@getMetadata field_x, field_y, c)
  getMetadata: (x, y, c=null) ->
    totw = @field_w * @w
    toth = @field_h * @h
    
    field_x_abs = null
    field_y_abs = null
    if c != null
      field_x_abs = (x-1) * @field_w + c.canvas.shiftX + (c.canvas.w - totw) / 2.0
      field_y_abs = (y-1) * @field_h + c.canvas.shiftY + (c.canvas.h - toth) / 2.0
    
    state = @map[x][y]
    stateName = @lifeObj.lifeTypes[@lifeObj.type].conditioner.translateStateID state
      
    
    return {
      x: x
      y: y
      absX: field_x_abs
      absY: field_y_abs
      state: state
      stateName: stateName
      type: @lifeObj.type
      color: @lifeObj.lifeTypes[@lifeObj.type].conditioner.colour @map[x][y]
      timeChanged: @metadata[x][y].timeChanged
      timeCurrent: @simTime
      lastState: @metadata[x][y].lastState
      lastStateName: (@lifeObj.lifeTypes[@lifeObj.type].conditioner.translateStateID (@metadata[x][y].lastState))
    }
  randomizeABit: (strength, value) ->
    if @stepLock
      return false
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
          @set x0, y0, value
  getStructFromSelectBox: () ->
    if not @selectBox?
      return {}
    struct = {}
    
    maxX = -1000000
    maxY = -1000000
    minX = 1000000
    minY = 1000000
    
    for x in [@selectBox.startX..@selectBox.endX] by 1
      for y in [@selectBox.startY..@selectBox.endY] by 1
        if @map[x][y] != 0
          maxX = Math.max(x, maxX)
          maxY = Math.max(y, maxY)
          minX = Math.min(x, minX)
          minY = Math.min(y, minY)
    
    shiftX = -minX
    shiftY = -minY
    
    for x in [@selectBox.startX..@selectBox.endX] by 1
      for y in [@selectBox.startY..@selectBox.endY] by 1
        if @map[x][y] != 0
          struct["#{x+shiftX}x#{y+shiftY}"] = (@lifeObj.lifeTypes[@lifeObj.type].conditioner.translateStateID @map[x][y])
    return struct
  countNodesInSelectBox: () ->
    if not @selectBox?
      return 0
    nodesCount = 0
    for x in [@selectBox.startX..@selectBox.endX] by 1
      for y in [@selectBox.startY..@selectBox.endY] by 1
        if @map[x][y] != 0
          ++nodesCount
    return nodesCount
  getSelectBox: () ->
    return @selectBox
  setSelectBox: (posA, posB) ->
    if not posA?
      @selectBox = null
      return false
    if not posB?
      @selectBox = null
      return false
    @selectBox = {
      startX: posA[0]
      startY: posA[1]
      endX: posB[0]
      endY: posB[1]
      width: posB[0]-posA[0]
      height: posB[1]-posB[1]
    }
  canvasXYToBoardXY: (x, y, c) ->
    totw = @field_w * @w
    toth = @field_h * @h
    field_x = Math.ceil((x - (c.canvas.w - totw) / 2.0)/@field_w)
    field_y = Math.ceil((y - (c.canvas.h - toth) / 2.0)/@field_h)
    return [field_x - c.canvas.shiftX, field_y - c.canvas.shiftY]
  setPastedStructure: (struct) ->
    @mousePasteStructure = struct
    if not struct?
      @mousePasteStructure = null
  paintPreview: (c, struct) ->
    if not struct?
      return false
  
    c.x.fillStyle = 'rgba(0, 45, 66, 0.1)'
    c.x.fillRect(0, 0, c.w, c.height)
    
    w = 10
    h = 10
    fieldShiftX = 4
    fieldShiftY = 4
    
    minX = 1000000
    minY = 1000000
    maxX = -1000000
    maxY = -1000000
    
    for pos, typeName of struct
      pos = pos.split 'x'
      minX = Math.min(parseInt(pos[0]), minX)
      maxX = Math.max(parseInt(pos[0]), maxX)
      minY = Math.min(parseInt(pos[1]), minY)
      maxY = Math.max(parseInt(pos[1]), maxY)
      
      
    fieldShiftX = -minX + 5
    fieldShiftY = -minY + 5
    w = Math.abs(maxX - minX + 10)
    h = Math.abs(maxY - minY + 10)
    w = Math.max(w, h)
    h = w
    
    zoom = 1
    field_margin_left = 0
    field_margin_top = 0
    field_w = (c.w*zoom) / w
    field_h = (c.h*zoom) / h

    field_w = Math.min field_w, field_h
    field_h = field_w
    totw = field_w * w
    toth = field_h * h

    shift_x = c.shiftX + (c.w - totw) / 2.0
    shift_y = c.shiftY + (c.h - toth) / 2.0

    field_rw = field_w - field_margin_left
    field_rh = field_h - field_margin_top
    for x in [0..w] by 1
      for y in [0..h] by 1
        c.x.save()
        c.x.translate(x*field_w+shift_x, y*field_h+shift_y)
        rgba = []
        rgba = @lifeObj.lifeTypes[@lifeObj.type].conditioner.colour 0
        #rgba[3] *= @alphaMask[x][y]
        rgba[3] = 1
        c.x.fillStyle = "rgba(" + (rgba.join ',') + ")"
        c.x.fillRect(-field_rw, -field_rh, field_rw+1, field_rh+1)
        c.x.restore()
    for pos, typeName of struct
      pos = pos.split 'x'
      x = parseInt(pos[0]) + fieldShiftX
      y = parseInt(pos[1]) + fieldShiftY
        
      c.x.save()
      c.x.translate(x*field_w+shift_x, y*field_h+shift_y)
      rgba = @lifeObj.lifeTypes[@lifeObj.type].conditioner.colour (@lifeObj.lifeTypes[@lifeObj.type].conditioner.translateStateName typeName)
      rgba[3] = 1
      c.x.fillStyle = "rgba(" + (rgba.join ',') + ")"
      c.x.fillRect(-field_rw, -field_rh, field_rw, field_rh)
      c.x.restore()
    
  paint: (c) ->
    zoom = 1.5
    field_margin_left = 2
    field_margin_top = 2
    @field_w = (c.w*zoom) / @w
    @field_h = (c.h*zoom) / @h

    @field_w = Math.min @field_w, @field_h
    @field_h = @field_w
    totw = @field_w * @w
    toth = @field_h * @h

    shift_x = c.shiftX + (c.w - totw) / 2.0
    shift_y = c.shiftY + (c.h - toth) / 2.0

    field_rw = @field_w - field_margin_left
    field_rh = @field_h - field_margin_top
    for x in [0..@w] by 1
      for y in [0..@h] by 1
        c.x.save()
        c.x.translate(x*@field_w+shift_x, y*@field_h+shift_y)
        
        rgba = []
        
        rgba = @lifeObj.lifeTypes[@lifeObj.type].conditioner.colour @map[x][y]
        #rgba[3] *= @alphaMask[x][y]
        rgba[3] = 1
        
        if @displayMode == 'persistent'
          if @metadata[x][y].lastState > 0
            lColor = @lifeObj.lifeTypes[@lifeObj.type].conditioner.colour (@metadata[x][y].lastState)
            lTime = @simTime - @metadata[x][y].timeChanged
            fact = 1/(lTime+10)*7
            fact = Math.max(Math.min(fact, 1), 0)
            rgba[0] = parseInt((1-fact)*rgba[0] + fact * lColor[0])
            rgba[1] = parseInt((1-fact)*rgba[1] + fact * lColor[1])
            rgba[2] = parseInt((1-fact)*rgba[2] + fact * lColor[2])
              
        rgba[0] = Math.min(Math.max(0, rgba[0]), 255)
        rgba[1] = Math.min(Math.max(0, rgba[1]), 255)
        rgba[2] = Math.min(Math.max(0, rgba[2]), 255)
          
        c.x.fillStyle = "rgba(" + (rgba.join ',') + ")"
        c.x.fillRect(-field_rw, -field_rh, field_rw, field_rh)

        if x == @hoveredFieldX && y == @hoveredFieldY
          cStrokeStyleBckp = c.x.strokeStyle
          cLineWidthBckp = c.x.lineWidth
          c.x.strokeStyle = 'white'
          c.x.lineWidth = '4'
          
          c.x.rect(-field_rw, -field_rh, field_rw, field_rh)
          c.x.stroke()
          
          c.x.lineWidth = cLineWidthBckp
          c.x.strokeStyle = cStrokeStyleBckp
       
        c.x.restore()
    
    if @mousePasteStructure?
      for posTxt, typeName of @mousePasteStructure
        pos = posTxt.split 'x'
       
        x = parseInt(pos[0]) + @hoveredFieldX
        y = parseInt(pos[1]) + @hoveredFieldY
        
        c.x.save()
        c.x.translate(x*@field_w+shift_x, y*@field_h+shift_y)
        rgba = @lifeObj.lifeTypes[@lifeObj.type].conditioner.colour (@lifeObj.lifeTypes[@lifeObj.type].conditioner.translateStateName typeName)
        rgba[3] = 1
        c.x.fillStyle = "rgba(" + (rgba.join ',') + ")"
        c.x.fillRect(-field_rw, -field_rh, field_rw, field_rh)
        c.x.restore()
    
    if @selectBox?
      for x in [@selectBox.startX..@selectBox.endX] by 1
        for y in [@selectBox.startY..@selectBox.endY] by 1
          rgba = [0, 255, 0, 0.3]
          c.x.save()
          c.x.translate(x*@field_w+shift_x, y*@field_h+shift_y)
          c.x.fillStyle = "rgba(" + (rgba.join ',') + ")"
          c.x.fillRect(-field_rw, -field_rh, field_rw, field_rh)
          c.x.restore()
    
module.exports = GOLMap