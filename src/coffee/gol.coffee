dat = require 'dat.gui'
gui = null
life = {}
c = null

CanvasHandlerPromise = require './CanvasHandlerPromise.coffee'
CanvasHandler = require './CanvasHandler.coffee'
GOLMap = require './GOLMap.coffee'
GOLCompiler = require './GOLCompiler.coffee'


defaultLifeTypes = {
  'Convway': {
    color: [255, 0, 0]
    templates: {
      'Blinker': {
        '0x0': 'Live'
        '0x1': 'Live'
        '0x2': 'Live'
      }
      'Toad': {
        '-1x0': 'Live'
        '0x0': 'Live'
        '0x1': 'Live'
        '1x0': 'Live'
        '1x1': 'Live'
        '2x1': 'Live'
      }
      'Block': {
        '0x0': 'Live'
        '0x1': 'Live'
        '1x0': 'Live'
        '1x1': 'Live'
      }
      'Beacon': {
        '0x0': 'Live'
        '0x1': 'Live'
        '1x0': 'Live'
        '1x1': 'Live'
        '2x2': 'Live'
        '2x3': 'Live'
        '3x2': 'Live'
        '3x3': 'Live'
      }
      'Beehive': {
        '0x1': 'Live'
        '1x0': 'Live'
        '2x0': 'Live'
        '3x1': 'Live'
        '1x2': 'Live'
        '2x2': 'Live'
      }
    }
    code: """
      set k: countRangeValues(1, Live)
      Live->Dead: k<2 || k>3
      Live->Live: k==2 || k==3
      Dead->Live: k==3
      Dead
    """
  }
  'x==y': {
    color: [0, 255, 0]
    code: """
      Dead: 0
      Dead: countRangeValues(3, Live) > 2
      Live: x==0 && y==0
      Live: (x-40)*(x-40) + (y-25)*(y-25) <= (countRangeValues(3, Live)+1)*(countRangeValues(3, Live)+1)
      Dead
    """
  }
  'V7': {
    color: [0, 0, 255]
    code: """
      Live->V1: 1
      V1: get(x-1,y) + get(x+1, y) + get(x,y-1) + get(x, y+1) == 1
      V2: get(x-1,y) + get(x+1, y) + get(x,y-1) + get(x, y+1) == 2
      V3: get(x-1,y) + get(x+1, y) + get(x,y-1) + get(x, y+1) == 3
      V4: get(x-1,y) + get(x+1, y) + get(x,y-1) + get(x, y+1) == 4
      V5: get(x-1,y) + get(x+1, y) + get(x,y-1) + get(x, y+1) == 5
      V6: 0
      V7: get(x-1,y) + get(x+1, y) + get(x,y-1) + get(x, y+1) == 6
      V7->V1: 1
      V0
    """
  }
}



module.exports = ((() ->
  
  codeInput = null
  codeOutput = null

  life.lifeTypes = defaultLifeTypes
  for name, props of life.lifeTypes
    life.lifeTypes[name].conditioner = (GOLCompiler.compile props.code)
  
  
  life.speed = 50
  life.currentTemplate = null
  
  life.props = {}
  life.displayMode = 'normal'
  
  life.compileGol = () ->
      
  life.setType = (name) ->
    life.type = name
    life.props = life.lifeTypes[life.type]
      
  life.clear = () ->
    life.map.clear()
  
  life.randomizeBoard = () ->
  
  life.codeInput = ''
  life.simulate = true
  life.type = Object.keys(life.lifeTypes)[0]
  
  updateTemplates = () ->
    templatesContentNode = $('#templatesContent')
    templatesContentNode.children().remove()
    if life.lifeTypes[life.type].templates?
      for templateName, templateProp of life.lifeTypes[life.type].templates
        templateNode = $ '<li></li>'
        templateNode.text templateName
        templatesContentNode.append templateNode
  
  window.onload = () ->
  
    $(document).ready () ->
      slyOptions = {
        horizontal: 1
        itemNav: 'forceCentered'
        activateOn: 'click',
        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1,
        startAt: 0,
        scrollBy: 1,
        activatePageOn: 'click',
        speed: 300,
        elasticBounds: 1,
        dragHandle: 1,
        dynamicHandle: 1,
        clickBar: 1,
      }
      
      slyContent = $('#slyContent')
      for lname, lprop of life.lifeTypes
        lnode = $("<li><div class='text'>#{lname}</div></li>")
        slyContent.append lnode
      
      slyFrame = new Sly($('#slyFrame'), slyOptions)
      
      slyFrame.on 'load', () ->
        curIndex = 0
        for lname, lprop of life.lifeTypes
          ((name, prop, index) ->
            slyFrame.on 'active', (eventName, eventIndex) ->
              if index == eventIndex
                life.setType name
          )(lname, lprop, curIndex)
          ++curIndex
          
      slyFrame.init()
      life.setType (Object.keys(life.lifeTypes)[0])
      
      templatesSlyOptions = {
        horizontal: 0
        itemNav: 'centered'
        activateOn: 'click',
        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1,
        startAt: 0,
        scrollBy: 1,
        activatePageOn: 'click',
        speed: 300,
        elasticBounds: 1,
        dragHandle: 1,
        dynamicHandle: 1,
        clickBar: 1,
      }
      
      updateTemplates()
      
      templatesFrame = new Sly($('#templatesFrame'), templatesSlyOptions)
      
      templatesFrame.on 'load', () ->
        templatesFrame.on 'active', (eventName, eventIndex) ->
          if life.lifeTypes[life.type].templates?
            templatesNames = Object.keys(life.lifeTypes[life.type].templates)
            selectedTemplateName = templatesNames[eventIndex]
            if life.currentTemplate == selectedTemplateName
              life.currentTemplate = null
              templatesFrameNode = $ '#templatesFrame'
              templatesFrameNode.find('li.active').removeClass('active')
              life.map.setPastedStructure null
            else
              life.currentTemplate = selectedTemplateName
            console.log "TEMPLATE ==> #{life.currentTemplate}"
            life.map.setPastedStructure life.lifeTypes[life.type].templates[life.currentTemplate]
          
      templatesFrame.init()
      
      
    console.log 'Window init dat.gui'
    gui = new dat.GUI()
    gui.add life, 'type'
    gui.add life, 'clear'
    gui.add life, 'randomizeBoard'
    gui.add life, 'codeInput'
    displayModeController = gui.add life, 'displayMode', [ 'normal', 'persistent' ]
    displayModeController.listen()
    
    #lifeColorController = gui.addColor life, 'lifeColor'
    #lifeColorController.listen()
    console.log(gui.__controllers)
    # gui.__controllers[3].domElement.childNodes[0].style.height = '450px'
    
    
    updateLifeNode = () ->
      
      lifeTypeNodeContent = $(gui.__controllers[0].domElement)
      lifeTypeNode = lifeTypeNodeContent.parent()
      lifeTypeNodeContent.css 'display', 'none'
      lifeTypeNode.parent().css 'height', '87px'
      lifeTypeNode.append """
        <div id='life-type-display'>
          <b id='life-type-name'></b>
          <br>
          <div id=''></div>
          <p id='life-type-description'>
            No details provided.
          </p>
        </div>
      """
      
      
      lifeTypeNameNode = lifeTypeNode.find '#life-type-name'
      lifeTypeNameNode.text life.type
      
      lifeTypeDescNode = lifeTypeNode.find '#life-type-description'
      lifeTypeDescNode.text (life.props.description || 'No description provided.')
    
    #lifeColorController.onChange (value) ->
    #  life.lifeTypes[life.type].color = value
    
    displayModeController.onChange (value) ->
      life.map.setDisplayMode value
    
    updateLifeNode()
    
    typeSessions = {}
    
    life.setType = (name) ->
    
      typeSessions[life.type] = life.map.saveSession()
    
      life.type = name
      life.props = life.lifeTypes[life.type]
      #life.lifeColor = life.props.color || [0, 0, 0]
      life.codeInput = life.props.code || ""
      if codeInput?
        codeInput.update life.codeInput
      updateLifeNode()
      updateTemplates()
      
      if typeSessions[name]?
        life.map.loadSession typeSessions[name]
      else
        life.map.reset()
        typeSessions[life.type] = life.map.saveSession()
      c.flush()
    
    eNode = $(gui.__controllers[3].domElement)
    pNode = eNode.parent()
    eNode.css 'display', 'none'
    pNode.parent().css 'height', '350px'
    pNode.append '<div id="datgui-code-input"></div>'
    codeInput = new CodeFlask()
    codeInput.run '#datgui-code-input', { language: 'javascript' }
    codeInput.update ""
    
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
          conditioner = life.compileGol code
          life.lifeTypes[life.type].code = code
          life.lifeTypes[life.type].conditioner = conditioner
          console.log code
    
        el.on 'keydown keyup changed', () ->
          clearTimeout tim
          tim = setTimeout () ->
            compileCode()
          , 250
        compileCode()
        life.stepAuto()
      , 500

  condNormal = (GOLCompiler.compile """
  set k: countRangeValues(1, Live)
  Live->Dead: k<2
  Live->Dead: k>3
  Live->Live: k == 2 || k == 3
  Dead->Live: k == 3
  Dead
  """
  )

  #                80, 50
  life.map = new GOLMap 80, 50, life
  
  $(document).ready () ->
    #template = document.querySelector('#fieldMaskTooltipContent')
    #tippy '#fieldMask', {
    #  html: template
    #  arrow: true
    #  animation: 'fade'
    #  distance: 15
    #  arrowTransform: 'scale(2)'
    #}
      
    # Hover listener
    life.map.onFieldHover (x, y, xAbs, yAbs, props) ->
    
      #if life.simulate
      #  return false
    
      templateStr = """
<b>Cell <i>#{x} x #{y}</i></b>
<br>
<b>Type:</b> <i>#{props.stateName}</i><br>

"""
      descFrameNode = $ '#propDisplay'
      descFrameColNode = descFrameNode.find '.col .box'
      descFrameStateNode = descFrameNode.find '.state'
      descFramePosNode = descFrameNode.find '.position'
      descFrameModifTimeNode = descFrameNode.find '.modifTime'
      descPrevTypeNode = descFrameNode.find '.prevType'
      
      descFrameStateNode.text "#{props.stateName}"
      descFramePosNode.text "#{x} x #{y}"
      descFrameColNode.css 'background', "rgb(#{props.color[0]},#{props.color[1]},#{props.color[2]})"
      descFrameModifTimeNode.text "#{props.timeCurrent-props.timeChanged} tick/-s ago"
      descPrevTypeNode.text "#{props.lastStateName}"
      
      
      #fmask = $('#fieldMask')
      #fmask.css 'width', "#{life.map.field_w}px"
      #fmask.css 'height', "#{life.map.field_h}px"
      #fmask.css 'left', "#{xAbs}px"
      #fmask.css 'top', "#{yAbs}px"
  
  c = (new CanvasHandler({
    id: '#golcanvas'
    w: () -> $(window).width() #$('#golcanvas').width()
    h: () -> $(window).height() #$('#golcanvas').height()
    onDrag: (x, y, c) ->
      c.moveBy (x*80), (y*50)
      c.flush()
    onMove: (x, y, c) ->
      life.map.onMouseMove x, y, c
    onClick: (x, y, c) ->
      mapCoords = life.map.canvasXYToBoardXY x, y, c
      
      drawStruct = false
      if life.currentTemplate?
        if life.lifeTypes[life.type].templates?
          drawStruct = true
          
      if drawStruct
        life.map.drawStructure mapCoords[0], mapCoords[1], (life.lifeTypes[life.type].templates[life.currentTemplate])
        life.currentTemplate = null
        life.currentTemplate = null
        templatesFrameNode = $ '#templatesFrame'
        templatesFrameNode.find('li.active').removeClass('active')
        life.map.setPastedStructure null
      else
        life.map.set mapCoords[0], mapCoords[1], 'Live'
  })).ready()
  
  
  life.randomizeBoardEx = (strength) ->
    life.map.randomizeABit strength, 'Live'
  
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
  life.compileGol = (code) ->
    if codeOutput?
      codeOutput.update code
    life.lifeTypes[life.type].conditioner = (GOLCompiler.compile code)

    
)())
