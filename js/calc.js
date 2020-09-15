String.prototype.isNum = function () {
  return !isNaN(parseFloat(this)) && isFinite(this);
};

// Operators with two arguments
let operators = {
  "+": {
    precedence: 2,
    associativity: "left",
    func: (x, y) => {
      return x + y;
    },
  },
  "-": {
    precedence: 2,
    associativity: "left",
    func: (x, y) => {
      return x - y;
    },
  },
  "*": {
    precedence: 3,
    associativity: "left",
    func: (x, y) => {
      return x * y;
    },
  },
  "/": {
    precedence: 3,
    associativity: "left",
    func: (x, y) => {
      return x / y;
    },
  },
  "^": {
    precedence: 5,
    associativity: "right",
    func: (x, y) => {
      return x ** y;
    },
  },
};

// Functions with arbitrarily many arguments and infinite precedence
let functions = {
  sqrt: {
    args: 1,
    func: Math.sqrt,
  },
  sin: {
    args: 1,
    func: Math.sin,
  },
  cos: {
    args: 1,
    func: Math.cos,
  },
  tan: {
    args: 1,
    func: Math.tan,
  },
  max: {
    args: 2,
    func: Math.max,
  },
  min: {
    args: 2,
    func: Math.min,
  },
  pi: {
    args: 0,
    func: () => {
      return Math.PI;
    },
  },
};

// Shunting-yard
function parseToRPN(expr) {
  let operatorStack = [];
  let output = [];

  let tokens = expr.split(" ");
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];

    if (token === "?") {
      console.log(output);
      console.log(operatorStack);
    } else if (token.isNum()) {
      output.push(parseFloat(token));
    } else if (Object.keys(functions).includes(token)) {
      operatorStack.push(token);
    } else if (Object.keys(operators).includes(token)) {
      let lastOp = operatorStack[operatorStack.length - 1];

      while (
        (Object.keys(operators).includes(lastOp) &&
          ((operators[token].associativity === "left" &&
            operators[token].precedence <= operators[lastOp].precedence) ||
            (operators[token].associativity === "right" &&
              operators[token].precedence < operators[lastOp].precedence))) ||
        Object.keys(functions).includes(lastOp)
      ) {
        output.push(operatorStack.pop());
        lastOp = operatorStack[operatorStack.length - 1];
      }
      operatorStack.push(token);
    } else if (token === "(") {
      operatorStack.push(token);
    } else if (token === ")") {
      // Pop all operators to output until left-parenthesis
      while (
        operatorStack[operatorStack.length - 1] !== "(" &&
        operatorStack.length
      ) {
        output.push(operatorStack.pop());
      }

      // Pop last parenthesis, but throw exception if one doesn't exist
      if (operatorStack[operatorStack.length - 1] === "(") {
        operatorStack.pop();
      } else {
        throw "Error while parsing! Mismatched parentheses!";
      }
    }
  }
  while (operatorStack.length) {
    let op = operatorStack.pop();
    if (op === "(") throw "Error while parsing! Mismatched parentheses!";
    else output.push(op);
  }
  return output;
}

function evalRPN(expr) {
  for (let i = expr.length - 1; i > -1; i--) {
    let token = expr[i];

    if (Object.keys(operators).includes(token)) {
      let result = operators[token].func(expr[i + 2], expr[i + 1]);

      expr.splice(i + 1, 2);
      expr[i] = result;
    } else if (Object.keys(functions).includes(token)) {
      let args = [];
      for (let j = functions[token].args; j > 0; j--) {
        args.push(expr[i + j]);
      }
      expr.splice(i + 1, functions[token].args);
      expr[i] = functions[token].func(...args);
    }
  }

  return expr[0];
}

function evaluateExpression() {
  let expr = document.getElementById("expr").value;

  try {
    let rpn = parseToRPN(expr);
    console.log(rpn);
    console.log(evalRPN(rpn.reverse()));
  } catch (e) {
    console.log(e);
  }
}
