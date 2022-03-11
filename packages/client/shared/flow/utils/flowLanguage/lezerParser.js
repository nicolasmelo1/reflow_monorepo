// This is a lezer parser to parse our code inside of the codemirror editor
// Reference: https://lezer.codemirror.net/docs/guide/
// This guide can help, but it works mostly by trial and error.
// You can also read javascript and try to see if you can understand: https://github.com/lezer-parser/javascript
//
// For quick prototyping you can access the 'http://localhost:3000/develoment/lezereditor' url.
// It will show a screen with the editor using the https://github.com/codemirror/lang-lezer as language,
// with the package https://github.com/ColinTimBarndt/lezer-tree-visualizer for visualizing the tree structure.
// If at the time of the reading, the lib is outdated or not working anymore, you can refer to:
// https://discuss.codemirror.net/t/whats-the-best-to-test-and-debug-grammars/2542/4 
// where the user explain how you can build it your own
//
// Every time you test it will show you the tree structure like this: 
// Script:
//  └╴Block:  
//    └╴StatementsList:    
//      └╴Statement:      
//        └╴ExpressionStatement:        
//          ├╴Expression:        
//          │ └╴Primary:        
//          │   └╴Atom:        
//          │     └╴Dict:        
//          │       ├╴{        
//          │       ├╴Atom:        
//          │       │ └╴Number: 1        
//          │       ├╴:        
//          │       ├╴Expression:        
//          │       │ └╴Primary:        
//          │       │   └╴Atom:        
//          │       │     └╴String: "a"        
//          │       ├╴Atom:        
//          │       │ └╴Number: 2        
//          │       ├╴:        
//          │       ├╴Expression:        
//          │       │ └╴FunctionDefinitionExpression:        
//          │       │   ├╴function        
//          │       │   ├╴(        
//          │       │   ├╴Arguments:        
//          │       │   │ └╴Variable: x        
//          │       │   ├╴)        
//          │       │   ├╴:        
//          │       │   └╴Expression:        
//          │       │     └╴Add:        
//          │       │       ├╴Expression:        
//          │       │       │ └╴Primary:        
//          │       │       │   └╴Atom:        
//          │       │       │     └╴Variable: x        
//          │       │       ├╴AddOperators: +        
//          │       │       └╴Expression:        
//          │       │         └╴Primary:        
//          │       │           └╴Atom:        
//          │       │             └╴Number: 1        
//          │       └╴}        
//          └╴⚠: 
//
// If You see this ⚠, something is wrong, the tree should ALWAYS be nicely formated. 
// (You can also print the format for javascript, or python, or other languages using the https://github.com/lezer-parser/javascript package) 
// Use the grammar in 'parser/index.js' for reference and guide. (Some things might change on the grammar here. The grammar on the parser is
// a guide for us to build our own parser)

const templateLiteral = '`'

function getLezerParser({
	includes='in', conjunction='and', disjunction='or', inversion='not', equality='is', inequality='is not',
	blockDo='do', blockEnd='end', nullValue='None', booleanTrue='True', booleanFalse='False', ifIf='if', 
	ifElse='else', functionKeyword='function', returnKeyword='return', raiseKeyword='raise', 
	tryKeyword='try', catchKeyword='otherwise', moduleKeyword='module', decimalPointSeparator='.', 
	positionalArgumentSeparator=',', dateCharacter='D', dateFormat='YYYY-MM-DD', 
	hourFormat='hh:mm:ss.SSS', documentationKeyword='@doc'
}={}) {

	const lezerParser = `
@top Script { Block }

@precedence {
	string,
	list @left,
	slice @right,
	attribute @right,
	return @right,
	raise @right,
	struct @right,
	funccall @right,
	product @left,
	add @left,
	compare @left,
	and @left,
	or @left
}

Block { (StatementsList)? }

Arguments { VariableDefinition | (VariableDefinition "=" Expression) } 
Parameters { (VariableDefinition "=" Expression) | Expression }

DocumentationStatement { decoratorKeyword<"${documentationKeyword}"> DocumentationBlockComment }

StatementsList { 
	((DocumentationStatement)? Statement)+
}

Statement {
	Assignment |
	ExpressionStatement { Expression+ LineBreak }
}

Assignment {
	AssignmentVariable "=" Expression
}

IfExpression { keyword<"${ifIf}"> Expression Do Block (ElseExpression | End) }
ElseExpression {
	keyword<"${ifElse}"> ( 
		Do Block |
		IfExpression
	) End
}

TryExpression { keyword<"${tryKeyword}"> Do Block (CatchExpression | End)}
CatchExpression { ${catchKeyword.split(' ').map(keyword => `keyword<"${keyword}">`).join(' ')} (("(")? VariableDefinition (")")?)? Do Block End } 

FunctionDefinitionExpression { 
	keyword<"${functionKeyword}"> (VariableDefinition)? "(" 
		(Arguments ((PositionalArgumentSeparator Arguments)+)?)? 
	")" ((Do Block End) | (":" Expression))
}

ModuleBlockStatementsList { (ModuleBlockStatements)+ }
ModuleBlockStatements {
	(DocumentationStatement)? (
		FunctionDefinitionExpression |
		ModuleDefinitionExpression | 
		AssignmentVariable ("=" Expression)?
	)
}
// Reference: https://lezer.codemirror.net/docs/guide/#allowing-ambiguity
ModuleDefinitionExpression {
	keyword<"${moduleKeyword}"> VariableDefinition 
		~module ("(" (Arguments ((PositionalArgumentSeparator Arguments)+)?)? ")")? 
		~module (Do (ModuleBlockStatementsList)? End)?
}

Expression { 
	FunctionDefinitionExpression |
	ModuleDefinitionExpression |
	IfExpression |
	TryExpression |
	Disjunction |
	Conjunction |
	Inversion |
	Comparison |
	Add | 
	Product |
	Unary |
	Primary
}

// Reference on the !or, !and and so on: https://github.com/lezer-parser/javascript/blob/2a8c2eb03fe5ddefacd616a5b91de11749a51144/src/javascript.grammar#L316
Disjunction { Expression !or keyword<"${disjunction}"> Expression }
Conjunction { Expression !and keyword<"${conjunction}"> Expression }
Inversion { ${inversion.split(' ').map(keyword => `keyword<"${keyword}">`).join(' ')} Expression }
Comparison { Expression !compare BooleanOperatorsAndKeywords Expression }
Add { Expression !add AddOperators Expression }
Product { Expression !product ProductOperators Expression }
Unary { AddOperators Expression }

Slice { Primary !slice "[" Atom "]"}
Attribute { Primary !attribute "." (Primary+)? }
FunctionCall { Primary !funccall "(" (Parameters ((PositionalArgumentSeparator Parameters)+)?)? (PositionalArgumentSeparator+)? ")" }
Struct { Primary !struct "{" (Parameters ((PositionalArgumentSeparator Parameters)+)?)? (PositionalArgumentSeparator+)? "}" }
SimpleStatements {
	ReturnStatement |
	RaiseStatement
}
ReturnStatement { keyword<"${returnKeyword}"> !return Expression }
RaiseStatement { keyword<"${raiseKeyword}"> !raise (Expression | (String PositionalArgumentSeparator Expression))}

Primary {
	!list (
		Slice |
		Attribute |
		FunctionCall | 
		Struct |
		SimpleStatements |
		Atom
	)
}

Atom {
	Number |
	Datetime |
	Boolean |
	Dict |
	ReflowVariable |
	List |
	keyword<"${nullValue}"> |
	!string String |
	"(" Expression ")" |
	Variable
}

AssignmentVariable { Primary }
VariableDefinition { identifier ~variable }
Variable { identifier ~variable }


// Operations or Operators
BooleanOperatorsAndKeywords {
	${inequality.split(' ').map(keyword => `keyword<"${keyword}">`).join(' |\n')} |
	keyword<"${equality}"> |
	keyword<"${includes}"> |
	BooleanOperators
}
AddOperators { unaryOperators }
ProductOperators { productOperators }
LineBreak { newlineEmpty }
Do { keyword<"${blockDo}"> }
End { keyword<"${blockEnd}"> }

// Keywords 
// Reference: https://github.com/lezer-parser/javascript/blob/2a8c2eb03fe5ddefacd616a5b91de11749a51144/src/javascript.grammar#L494
keyword<term> { @specialize[@name={term}]<identifier, term> }
decoratorKeyword<term> { @specialize[@name={term}]<decorator, term> }

// Special Objects
Boolean { @specialize<identifier, "${booleanTrue}" | "${booleanFalse}"> }
Datetime { 
"~${dateCharacter}[" ${dateFormat.replaceAll(/[^YMD]/g, (match) => ` "${match}" `).replaceAll(/(YYYY|MM|DD)/g, 'Number')}
	(whitespace Number 
	(":" Number 
		(":" Number 
		("." Number)?
		)?
	)?
	)? "]" 
}
Dict { "{" Atom ":" Expression ((PositionalArgumentSeparator Atom ":" Expression)+)? "}" }
List { "[" Expression ((PositionalArgumentSeparator Expression)+)? "]" }

// To skip
@skip { spaces | newline | LineComment }

@tokens {
	@precedence { newline, newlineEmpty }
	newlineEmpty { "\n" }
	whitespace { $[\s] }

	spaces[@export] { $[\u0009 \u000b\u00a0\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]+ }
	newline[@export] { $[\r\n\u2028\u2029] }
	
	ReflowVariable { "{{" ![}}]+ }

	LineComment { "#" ![\n]+ }
	DocumentationBlockComment { "/*" ![*/]+ "*/" }
	Number { $[0-9]+ ("${decimalPointSeparator}" $[0-9]+)? }
	String {
	'"' (![\"]+)? '"'|
	"'" (![']+)? "'" |
	"${templateLiteral}" (![${templateLiteral}]+)? "${templateLiteral}"
	}

	identifier { $[A-Za-zÀ-ÖØ-öø-ÿ_] ($[A-Za-zÀ-ÖØ-öø-ÿ0-9_]+)? }
	decorator { "@" identifier }

	"(" ")" "[" "]" "{" "}"
	"." "\n" "-" ":"
	PositionalArgumentSeparator { "${positionalArgumentSeparator}" }

	// Operations
	BooleanOperators { "==" | ">" | "=>" | "<" | "=<" | "!=" }
	unaryOperators { "+" | "-" }
	productOperators { "*" | "/" | "%" | "^" | "*" }
}

@detectDelim
`
	return lezerParser
}

export default getLezerParser