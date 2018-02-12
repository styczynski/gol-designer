((() ->

  codeInput = null
  codeOutput = null

  window.onUpdateCompiledCode = (code) ->
    if codeOutput?
      codeOutput.update code

  require './gol.coffee'

  compileCode = () ->
    el = $('#code-wrapper')
    code = el.text()
    window.golCompileCode code
    console.log code

  $(document).ready () ->
    codeInput = new CodeFlask()
    codeInput.run '#code-wrapper', { language: 'javascript' }
    codeInput.update """
Live: Math.random() > 0.99
Live->Live2: Math.random()>0.99
Live->Live: true
Live2->Live2: true
Dead
    """
    codeOutput = new CodeFlask()
    window.codeOutput = codeOutput
    codeOutput.run '#code-wrapper-out', { language: 'javascript' }

    el = $('#code-wrapper')
    tim = -1
    el.on 'keydown keyup changed', () ->
      clearTimeout tim
      tim = setTimeout () ->
        compileCode()
      , 250
    compileCode()
)())
