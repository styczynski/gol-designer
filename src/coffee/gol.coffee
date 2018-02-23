PAGE_URL = "http://styczynski.in/gol-designer"


dat = require 'dat.gui'
gui = null
life = {}
c = null

CanvasHandlerPromise = require './CanvasHandlerPromise.coffee'
CanvasHandler = require './CanvasHandler.coffee'
GOLMap = require './GOLMap.coffee'
GOLCompiler = require './GOLCompiler.coffee'



serializeState = () ->
  life.typeSessions[life.type] = life.map.saveSession()
  
  compressedSessions = {}
  for k, v of life.typeSessions
    compressedSessions[k] = {}
    compressedSessions[k].ltype = v.ltype
    compressedSessions[k].map = v.map
  
  o = JSON.stringify({
    typeSessions: compressedSessions
    type: life.type
    lifeTypes: life.lifeTypes
  })
  return LZString.compressToEncodedURIComponent(o)
   
serializeStateUrl = () ->
  return PAGE_URL+'?s='+serializeState()
   
deserializeState = (o) ->
  o = LZString.decompressFromEncodedURIComponent(o)
  console.log o
  o = JSON.parse o
  life.typeSessions = o.typeSessions
  life.type = o.type
  life.lifeTypes = o.lifeTypes
  for k, v of life.lifeTypes
    code = v.code
    conditioner = GOLCompiler.compile code
    v.conditioner = conditioner
  life.map.loadSession life.typeSessions[life.type]

deserializeStateUrl = (url) ->
  o = (url.split '?s=')[1]
  deserializeState o

defaultLifeTypes = {
  'Convway': {
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
      "Boat": {
        "0x0":"Live"
        "0x1":"Live"
        "1x0":"Live"
        "1x2":"Live"
        "2x1":"Live"
      }
      "Tub": {
        "0x1":"Live"
        "1x0":"Live"
        "1x2":"Live"
        "2x1":"Live"
      }
      "Glider": {
        "0x2":"Live"
        "1x0":"Live"
        "1x2":"Live"
        "2x1":"Live"
        "2x2":"Live"
      }
      "LWSS": {
        "0x0":"Live"
        "0x2":"Live"
        "1x3":"Live"
        "2x3":"Live"
        "3x0":"Live"
        "3x3":"Live"
        "4x1":"Live"
        "4x2":"Live"
        "4x3":"Live"
      }
      "GospelGun": {
        "0x4":"Live"
        "0x5":"Live"
        "1x4":"Live"
        "1x5":"Live"
        "10x4":"Live"
        "10x5":"Live"
        "10x6":"Live"
        "11x3":"Live"
        "11x7":"Live"
        "12x2":"Live"
        "12x8":"Live"
        "13x2":"Live"
        "13x8":"Live"
        "14x5":"Live"
        "15x3":"Live"
        "15x7":"Live"
        "16x4":"Live"
        "16x5":"Live"
        "16x6":"Live"
        "17x5":"Live"
        "20x2":"Live"
        "20x3":"Live"
        "20x4":"Live"
        "21x2":"Live"
        "21x3":"Live"
        "21x4":"Live"
        "22x1":"Live"
        "22x5":"Live"
        "24x0":"Live"
        "24x1":"Live"
        "24x5":"Live"
        "24x6":"Live"
        "34x2":"Live"
        "34x3":"Live"
        "35x2":"Live"
        "35x3":"Live"
      }
      "Pulsar": {
        "0x2":"Live"
        "0x3":"Live"
        "0x4":"Live"
        "0x8":"Live"
        "0x9":"Live"
        "0x10":"Live"
        "2x0":"Live"
        "2x5":"Live"
        "2x7":"Live"
        "2x12":"Live"
        "3x0":"Live"
        "3x5":"Live"
        "3x7":"Live"
        "3x12":"Live"
        "4x0":"Live"
        "4x5":"Live"
        "4x7":"Live"
        "4x12":"Live"
        "5x2":"Live"
        "5x3":"Live"
        "5x4":"Live"
        "5x8":"Live"
        "5x9":"Live"
        "5x10":"Live"
        "7x2":"Live"
        "7x3":"Live"
        "7x4":"Live"
        "7x8":"Live"
        "7x9":"Live"
        "7x10":"Live"
        "8x0":"Live"
        "8x5":"Live"
        "8x7":"Live"
        "8x12":"Live"
        "9x0":"Live"
        "9x5":"Live"
        "9x7":"Live"
        "9x12":"Live"
        "10x0":"Live"
        "10x5":"Live"
        "10x7":"Live"
        "10x12":"Live"
        "12x2":"Live"
        "12x3":"Live"
        "12x4":"Live"
        "12x8":"Live"
        "12x9":"Live"
        "12x10":"Live"
      }
      "Pentadecathlon": {
        "0x2":"Live"
        "0x7":"Live"
        "1x0":"Live"
        "1x1":"Live"
        "1x3":"Live"
        "1x4":"Live"
        "1x5":"Live"
        "1x6":"Live"
        "1x8":"Live"
        "1x9":"Live"
        "2x2":"Live"
        "2x7":"Live"
      }
      "ExpGrow1": {
        "0x0":"Live"
        "0x1":"Live"
        "0x4":"Live"
        "1x0":"Live"
        "1x3":"Live"
        "2x0":"Live"
        "2x3":"Live"
        "2x4":"Live"
        "3x2":"Live"
        "4x0":"Live"
        "4x2":"Live"
        "4x3":"Live"
        "4x4":"Live"
      }
      "ExpGrow2": {
        "0x5":"Live"
        "2x4":"Live"
        "2x5":"Live"
        "4x1":"Live"
        "4x2":"Live"
        "4x3":"Live"
        "6x0":"Live"
        "6x1":"Live"
        "6x2":"Live"
        "7x1":"Live"
      }
      "TheRPentomino": {
        "0x1":"Live"
        "1x0":"Live"
        "1x1":"Live"
        "1x2":"Live"
        "2x0":"Live"
      }
      "DieHard": {
        "0x1":"Live"
        "1x1":"Live"
        "1x2":"Live"
        "5x2":"Live"
        "6x0":"Live"
        "6x2":"Live"
        "7x2":"Live"
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
  'Highlife': {
    templates: {
      "Replicator": {
        "0x2":"Live"
        "0x3":"Live"
        "0x4":"Live"
        "1x1":"Live"
        "1x4":"Live"
        "2x0":"Live"
        "2x4":"Live"
        "3x0":"Live"
        "3x3":"Live"
        "4x0":"Live"
        "4x1":"Live"
        "4x2":"Live"
      }
      "Bomber": {
        "0x2":"Live"
        "0x3":"Live"
        "0x4":"Live"
        "1x1":"Live"
        "1x4":"Live"
        "2x0":"Live"
        "2x4":"Live"
        "3x0":"Live"
        "3x3":"Live"
        "4x0":"Live"
        "4x1":"Live"
        "4x2":"Live"
        "5x9":"Live"
        "5x10":"Live"
        "5x11":"Live"
        "12x6":"Live"
        "12x7":"Live"
        "12x8":"Live"
        "13x6":"Live"
        "13x8":"Live"
        "14x6":"Live"
        "14x7":"Live"
        "14x8":"Live"
      }
    }
    code: """
      set k: countRangeValues(1, Live)
      Live->Dead: k<2 || k>3
      Live->Live: k==2 || k==3
      Dead->Live: k==3 || k==6
      Dead
    """
  }
  'Bubble': {
    templates: {}
    code: """
      Dead: 0
      Dead: countRangeValues(3, Live) > 2
      Live: x==0 && y==0
      Live: (x-40)*(x-40) + (y-25)*(y-25) <= (countRangeValues(3, Live)+1)*(countRangeValues(3, Live)+1)
      Dead
    """
  }
  'ColorExplosion': {
    templates: {
      'Dot': {
        '0x0': 'V1'
      }
      'V3-Block': {
        '0x0': 'V3'
        '1x0': 'V3'
        '0x1': 'V3'
        '1x1': 'V3'
      }
    }
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

  templatesFrame = null
  templatesFrameIndex = 0
  
  lifeSelectMode = false
  
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
    
  life.serializeState = serializeState
  life.deserializeState = deserializeState
  
  life.randomizeBoard = () ->
  
  life.codeInput = ''
  life.simulate = true
  life.type = Object.keys(life.lifeTypes)[0]
  
  updateTemplates = () ->
  
  lifeDrawValue = 'Live'
  
  showSeeUrlDialog = () ->
    dialog = $('#seeUrlDialog')
    dialog.css 'display', 'block'
    dialog.find('.url').text "Generating url..."
    url = serializeStateUrl()
    dialog.find('.url').text url
  
  hideSeeUrlDialog = () ->
    dialog = $('#seeUrlDialog')
    dialog.css 'display', 'none'
  
  saveLifeDialogIsShown = false
  showSaveLifeDialog = () ->
    saveLifeDialogIsShown = true
    dialog = $('#saveLifeDialog')
    dialog.css 'display', 'block'
    lifeSaveStatsText = """
Life nodes: #{life.map.countNodesInSelectBox()}
"""
    $('#saveLifeDialog div.row .stats').text lifeSaveStatsText
  
  hideSaveLifeDialog = () ->
    saveLifeDialogIsShown = false
    dialog = $('#saveLifeDialog')
    dialog.css 'display', 'none'
  
  
  saveSelectionAsLife = (name) ->
    if not life.lifeTypes[life.type].templates?
      life.lifeTypes[life.type].templates = {}
    life.lifeTypes[life.type].templates[name] = life.map.getStructFromSelectBox()
  
  boardToolsController = {
    update: () ->
  }
  boardTools = {
    'Select': {
      type: 'radio'
      icon: 'fas fa-crop'
      onActivated: () ->
        lifeSelectMode = true
      onDeactivated: () ->
        if saveLifeDialogIsShown
          return false
        lifeSelectMode = false
        life.map.setSelectBox null, null
        boardToolsController.update()
        c.flush()
    }
    'Copy': {
      type: 'button'
      icon: 'fas fa-clone'
      onClicked: () ->
        showSaveLifeDialog()
      isEnabled: () ->
        return life.map.getSelectBox() != null
    }
    'Remove': {
      type: 'radio'
      icon: 'fas fa-times'
      onActivated: () ->
        lifeDrawValue = null
      onDeactivated: () ->
        lifeDrawValue = 'Live'
    }
    'Save': {
      type: 'button'
      icon: 'far fa-save'
      onClicked: () ->
        showSeeUrlDialog()
      isEnabled: () -> true
    }
  }
  
  
  
  installTemplatesFrameHook = () ->
    templatesFrame.on 'active', (eventName, eventIndex) ->
      if eventIndex >= templatesFrameIndex
        return false
      
      if life.lifeTypes[life.type].templates?
        templatesNames = Object.keys(life.lifeTypes[life.type].templates)
        selectedTemplateName = templatesNames[eventIndex]
        if life.currentTemplate == selectedTemplateName
          life.currentTemplate = null
          templatesFrameNode = $ '#templatesFrame'
          #templatesFrameNode.find('li.active').removeClass('active')
          life.map.setPastedStructure null
          templatesFrame.activate templatesFrameIndex
        else
          life.currentTemplate = selectedTemplateName
        life.map.setPastedStructure life.lifeTypes[life.type].templates[life.currentTemplate]
      return true
  
  updateTemplates = () ->
    if templatesFrame?
      templatesFrame.destroy()
      $('#templatesFrame').sly(false)
      templatesFrame = null
      templatesFrameIndex = 0
      
    templatesContentNode = $('#templatesContent')
    templatesContentNode.children().remove()
    if life.lifeTypes[life.type].templates?
      
      for templateName, templateProp of life.lifeTypes[life.type].templates
        templateNode = $ '<li></li>'
        templateNode.append $("<div class='templateRowName'>#{templateName}</div>")
        templateNode.append $("<div class='templateRowPreview'><canvas class='templateRowPreviewCanvas#{templateName}'></canvas></div>")
        templatesContentNode.append templateNode
        
        templatePreviewCanvas = templatesContentNode.find ".templateRowPreviewCanvas#{templateName}"
        templatePreviewCtx = templatePreviewCanvas[0].getContext("2d")
        
        templatePreviewC = {
          x: templatePreviewCtx
          dom: templatePreviewCanvas
          w: 300
          h: 200
          shiftX: 0
          shiftY: 0
        }
        templatePreviewCanvas.css 'width', '69px'
        templatePreviewCanvas.css 'height', '50px'
        
        life.map.paintPreview templatePreviewC, templateProp
        
        
        ++templatesFrameIndex
      templateNode = $ '<li class="template-null"></li>'
      #templateNode.css 'display', 'none'
      templateNode.css 'opacity', '0'
      templatesContentNode.append templateNode
        
    if not templatesFrame?
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
      templatesFrame = new Sly($('#templatesFrame'), templatesSlyOptions)
      
      templatesFrame.on 'load', () ->
        templatesFrame.activate templatesFrameIndex
        installTemplatesFrameHook()
      
      templatesFrame.init()
  
  window.onload = () ->
  
    $(document).ready () ->
      
      hideSaveLifeDialog()
      hideSeeUrlDialog()
      
      $('#saveLifeDialog div.btn.save').click () ->
        saveSelectionAsLife( $("div.row.lifeName input").val() )
        hideSaveLifeDialog()
        lifeSelectMode = false
        life.map.setSelectBox null, null
        boardToolsController.update()
        c.flush()
        updateTemplates()
      
      $('div.btn.ok').click () ->
        hideSeeUrlDialog()
      
      $('div.btn.cancel').click () ->
        hideSaveLifeDialog()
    
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
      
      updateTemplates()
      
      
    gui = new dat.GUI()
    gui.add life, 'type'
    gui.add life, 'clear'
    gui.add life, 'randomizeBoard'
    gui.add life, 'codeInput'
    displayModeController = gui.add life, 'displayMode', [ 'normal', 'persistent' ]
    displayModeController.listen()
    
    #lifeColorController = gui.addColor life, 'lifeColor'
    #lifeColorController.listen()
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
    
    life.typeSessions = {}
  
    
    life.setType = (name) ->
    
      life.typeSessions[life.type] = life.map.saveSession()
    
      life.type = name
      life.props = life.lifeTypes[life.type]
      #life.lifeColor = life.props.color || [0, 0, 0]
      life.codeInput = life.props.code || ""
      if codeInput?
        codeInput.update life.codeInput
      updateLifeNode()
      updateTemplates()
      
      if life.typeSessions[name]?
        life.map.loadSession life.typeSessions[name]
      else
        life.map.reset()
        life.typeSessions[life.type] = life.map.saveSession()
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
        
        boardToolsController.update = () ->
          for k, v of boardTools
            if v.type == 'button'
              if v.isEnabled?
                v.enabled = v.isEnabled()
              else
                v.enabled = true
              isButtonEnabled = true
              if v.enabled?
                isButtonEnabled = v.enabled
              if isButtonEnabled
                toolBoxNode.find("div.tool.#{k}").removeClass 'disabled'
                toolBoxNode.find("div.tool.#{k}").addClass 'enabled'
              else
                toolBoxNode.find("div.tool.#{k}").removeClass 'enabled'
                toolBoxNode.find("div.tool.#{k}").addClass 'disabled'
        
        
        
        toolBoxNode = $('#toolbox')
        for toolName, toolProps of boardTools
          ((name, props) ->
            toolNode = $("<div class='tool #{name}'><i class='#{props.icon}'></i></div>")
            toolNode.click () ->
              
              isActiveNow = $(this).hasClass('active')
              
              boardToolsController.update()
              
              if not isActiveNow
                if props.type == 'button'
                  isButtonEnabled = true
                  if props.enabled?
                    isButtonEnabled = props.enabled
                  if isButtonEnabled
                    props.onClicked()
                    toolBoxNode.find('.active').removeClass 'active'
                else
                  props.onActivated()
                  toolBoxNode.find('.active').removeClass 'active'
                  $(this).addClass 'active'
              else
                if props.type != 'button'
                  props.onDeactivated()
                toolBoxNode.find('.active').removeClass 'active'
                  
              for k, v of boardTools
                if k != name
                  if v.type == 'radio'
                    v.onDeactivated()
            toolBoxNode.append toolNode
          )(toolName, toolProps)
      
        boardToolsController.update()
      
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
    
        el.on 'keydown keyup changed', () ->
          clearTimeout tim
          tim = setTimeout () ->
            compileCode()
          , 250
        compileCode()
        
        
                
        setTimeout () ->
          console.log "CHECK URL"
          if window?
            if window.location?
              if window.location.href?
                if (window.location.href.indexOf '?s=') != -1
                  console.log "DESERIALIZE_URL"
                  deserializeStateUrl window.location.href
          life.stepAuto()
        , 500
        
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
    onDrag: (x, y, c, coords) ->
      console.log "[ DRAG ]  select-mode = #{lifeSelectMode}"
      if lifeSelectMode
        #c.flush()
        #oldFillStyle = c.canvas.x.fillStyle
        #c.canvas.x.fillStyle = 'rgba(0, 255, 0, 0.3)'
        #c.canvas.x.fillRect(coords.startX, coords.startY, coords.endX, coords.endY)
        #c.canvas.x.fillStyle = oldFillStyle
        posA = life.map.canvasXYToBoardXY coords.startX, coords.startY, c
        posB = life.map.canvasXYToBoardXY coords.endX, coords.endY, c
        life.map.setSelectBox posA, posB
        boardToolsController.update()
      else
        life.map.setSelectBox null, null
        boardToolsController.update()
        c.moveBy (x*80), (y*50)
      c.flush()
      
    onMove: (x, y, c) ->
      life.map.onMouseMove x, y, c
    onClick: (x, y, c) ->
      console.log "[ CLICK ]  Draw with = #{lifeDrawValue}"
    
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
        #templatesFrameNode.find('li.active').removeClass('active')
        life.map.setPastedStructure null
        templatesFrame.activate templatesFrameIndex
      else
        if not lifeDrawValue?
          life.map.setValue mapCoords[0], mapCoords[1], 0
        else
          life.map.set mapCoords[0], mapCoords[1], lifeDrawValue
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
