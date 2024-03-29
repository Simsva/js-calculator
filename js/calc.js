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
      return Math.pow(x, y);
    },
  },
};

// Functions with arbitrarily many arguments and infinite precedence
let functions = {
  sqrt: {
    args: 1,
    func: Math.sqrt,
  },
  ln: {
    args: 1,
    func: Math.log,
  },
  exp: {
    args: 1,
    func: Math.exp,
  },
  log: {
    args: 1,
    func: Math.log10,
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
  asin: {
    args: 1,
    func: Math.asin,
  },
  acos: {
    args: 1,
    func: Math.acos,
  },
  atan: {
    args: 1,
    func: Math.atan,
  },
  // Trig functions in degrees (really jank)
  deg_sin: {
    args: 1,
    func: (x) => Math.sin((x * Math.PI) / 180),
  },
  deg_cos: {
    args: 1,
    func: (x) => Math.cos((x * Math.PI) / 180),
  },
  deg_tan: {
    args: 1,
    func: (x) => Math.tan((x * Math.PI) / 180),
  },
  deg_asin: {
    args: 1,
    func: (x) => (Math.asin(x) * 180) / Math.PI,
  },
  deg_acos: {
    args: 1,
    func: (x) => (Math.acos(x) * 180) / Math.PI,
  },
  deg_atan: {
    args: 1,
    func: (x) => (Math.atan(x) * 180) / Math.PI,
  },
  // Multiargument function test
  max: {
    args: 2,
    func: Math.max,
  },
  min: {
    args: 2,
    func: Math.min,
  },
  // Jank constants
  pi: {
    args: 0,
    func: () => {
      return Math.PI;
    },
  },
  e: {
    args: 0,
    func: () => {
      return Math.E;
    },
  },
};

// Shunting-yard
function parseToRPN(expr) {
  let operatorStack = [];
  let output = [];

  for (let i = 0; i < expr.length; i++) {
    let token = expr[i];

    /* if (token === "?") {
      console.log(output);
      console.log(operatorStack);
    } else */
    if (token.isNum()) {
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
