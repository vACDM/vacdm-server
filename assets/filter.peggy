Filter
  = ComparingFilter / CombiningFilter

Filters
  = f:Filter _ fs:Filters {return [f, ...fs]}
  / f:Filter {return [f]}


CombiningFilter
  = "(" comb:Combinator _ filters:Filters ")" {return {[comb]: filters}}

ComparingFilter
  = "(" _ field:Field _ comp:Comparator _ value:String _ ")" {return {[field]: {[comp]: value}}}

Field =
  s:String {
    switch(s) {
      default: return s; // PLACEHOLDER_REPLACE_THIS_LINE
    }
  }

String "string"
  = s:[a-zA-Z0-9]+ {return s.join('')}

Comparator "comparator"
  = "<=" {return "$lte"}
  / ">=" {return "$gte"}
  / "!=" {return "$neq"}
  / "=" {return "$eq"}
  / ">" {return "$gt"}
  / "<" {return "$lt"}

Combinator "combinator"
  = "|" {return "$or"}
  / "&" {return "$and"}

_ "whitespace"
  = [ \t\n\r]*