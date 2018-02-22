#  aliveColour = [198, 45, 66, 1]
aliveColour = [
  [230, 230, 230, 1]
  [31, 141, 214, 1]
  [233, 50, 45, 1]
  [97, 204, 79, 1]
  [139, 160, 30, 1]
  [160, 91, 30, 1]
  [30, 160, 155, 1]
]
deadColour  = [66, 66, 66, 0.1]

uniqueArray = (arr) ->
  a = arr.concat()
  for i in [0..a.length-1] by 1
    for j in [i+1..a.length-1] by 1
      if a[i] == a[j]
        a.splice j--, 1
  return a

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

class GOLCompiler
  compile: (code) ->
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
      statesNames = uniqueArray(statesNames.concat(match[1].split(/->|,/g)))
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
        colIndex = v%aliveColour.length
        colIndex = 0 if not aliveColour[colIndex]?
        [
          aliveColour[colIndex][0]
          aliveColour[colIndex][1]
          aliveColour[colIndex][2]
          aliveColour[colIndex][3]
          #Math.min(aliveColour[0], deadColour[0]) + (v/(@states-1))*Math.abs(aliveColour[0] - deadColour[0])
          #Math.min(aliveColour[1], deadColour[1]) + (v/(@states-1))*Math.abs(aliveColour[1] - deadColour[1])
          #Math.min(aliveColour[2], deadColour[2]) + (v/(@states-1))*Math.abs(aliveColour[2] - deadColour[2])
          #Math.min(aliveColour[3], deadColour[3]) + (v/(@states-1))*Math.abs(aliveColour[3] - deadColour[3])
        ]
    }
    conditioner.translateStateID = (id) ->
      for kname,kid of statesNamesAliases
        if id == kid
          return kname
      return 'Unknown'
    conditioner.translateStateName = (name) ->
      if not statesNamesAliases[name]?
        if defaultDecl != null
          return 0
        else
          return 0
      return statesNamesAliases[name]
    conditioner.states = statesNames.length
    code = "(function(x, y, map){\n#{code}})"

    #window.onUpdateCompiledCode( code_without_decl )

    console.log code
    fn = null
    try
      fn = eval code
    catch e
      throw new Error "Internal "+e
    conditioner.step = fn
    return conditioner

module.exports = new GOLCompiler()