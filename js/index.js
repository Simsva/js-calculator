function evaluate(stack) {
  let result;
  try {
    // Replace some characters so the parser understands
    console.log(stack);
    let correctedStack = stack
      .join(" ")
      .replace(/÷/g, "/")
      .replace(/⨯/g, "*")
      .replace(/−/g, "-")
      .replace(/√/g, "sqrt")
      .replace(/π/g, "pi")
      .split(" ");

    if (trigDeg) {
      correctedStack = correctedStack
        .join(" ")
        .replace(/sin/g, "deg_sin")
        .replace(/cos/g, "deg_cos")
        .replace(/tan/g, "deg_tan")
        .replace(/asin/g, "deg_asin")
        .replace(/acos/g, "deg_acos")
        .replace(/atan/g, "deg_atan")
        .split(" ");
    }

    console.log(correctedStack);
    let rpn = parseToRPN(correctedStack);
    console.log(rpn);
    result = evalRPN(rpn.reverse()).toString().replace("-", "−");
    console.log(result);
  } catch (e) {
    console.error(e);
  }

  return result;
}

let inverse = false,
  trigDeg = false;
// Clears everything on back press when non-zero
// Decrements by one every button press (so when
// set to 2 it carries over to the next press)
let clearAll = 0;
let stack = [],
  currentNum = "";
function handleClick(name) {
  switch (name) {
    // TODO: Implement % and ! support
    // TODO: Add inverse functions
    // TODO: Clean up/separate code
    // Yes, really (this was temporary but now I'm too lazy to change it)
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    case "0":
      console.log("Num ", name);
      if (isNaN(currentNum) && currentNum !== "−" && currentNum !== ".") {
        stack.push(currentNum, "⨯");
        currentNum = "";
      } else if (stack[stack.length - 1] === ")") stack.push("⨯");

      currentNum += name;
      break;
    case ".":
      console.log("Decimal");
      if (!currentNum.includes(".")) {
        currentNum += name;
      }
      break;
    case "÷":
    case "⨯":
    case "−":
    case "+":
    case "^":
    case "(":
    case ")":
      console.log("Op ", name);
      if (currentNum === "") {
        if (name === "−") currentNum = "−";
        else if (name === "(") stack.push("(");
        // Jank way to check if operators can be put on top of the stack
        // TODO: Switch from a switch statement (hehe) to something more dynamic
        else if ([")", "e", "π"].includes(stack[stack.length - 1]))
          stack.push(name);
      } else {
        if (name === "(") stack.push(currentNum, "⨯", name);
        else stack.push(currentNum, name);
        currentNum = "";
      }
      break;
    case "=":
      console.log("Eq");
      if (currentNum || stack.length) {
        if (currentNum !== "") {
          stack.push(currentNum);
        }

        let result = evaluate(stack);

        if (result && !isNaN(result)) {
          currentNum = result;
          stack = [];
          // Clear everything on next BACK press
          clearAll = 2;
        } else if (stack.length > 0 && stack[stack.length - 1].isNum()) {
          currentNum = stack.pop();
        }
      }
      break;
    case "←":
      console.log("Back");
      if (clearAll) {
        stack = [];
        currentNum = "";
      }

      if (currentNum === "") {
        stack.pop();
        if (stack.length > 0 && stack[stack.length - 1].isNum()) {
          currentNum = stack.pop();
        }
      } else {
        currentNum = currentNum.slice(0, -1);
      }
      break;
    case "INV":
    case "DEG":
    case "RAD":
      console.log("Toggle ", name);
      if (name === "INV") inverse = !inverse;
      else trigDeg = !trigDeg;
      break;
    case "sin":
    case "cos":
    case "tan":
    case "ln":
    case "log":
    case "√":
    case "asin":
    case "acos":
    case "atan":
    case "exp":
    case "10^x":
    case "x^2":
      console.log("Function ", name);
      if (name === "x^2") {
        if (currentNum !== "") {
          stack.push(curentNum, "^", "2");
          currentNum = "";
        }
      } else {
        if (currentNum !== "") {
          stack.push(currentNum, "⨯");
          currentNum = "";
        }
        if (name === "10^x") stack.push("10", "^");
        else stack.push(name, "(");
      }
      break;
    case "π":
    case "e":
      console.log("Const ", name);
      if (currentNum !== "") {
        stack.push(currentNum, "⨯");
      } else if (stack[stack.length - 1] === ")") stack.push("⨯");
      currentNum = name;
      break;
  }

  if (clearAll) clearAll--;

  // Display current expression
  let expr = document.getElementById("expression");
  expr.innerText = stack.join("") + currentNum;

  // Display temporary value
  if (expr.innerText) {
    let tmpAnswer = document.getElementById("tmpAnswer");
    let tmpResult = evaluate(stack.concat([currentNum]));

    tmpAnswer.innerText =
      isFinite(tmpResult) && tmpResult !== expr.innerText ? tmpResult : "";
  }

  // Toggle button names
  let trigTypeButtons = document.querySelectorAll(".trigbutton");
  for (let i = 0; i < trigTypeButtons.length; i++)
    trigTypeButtons[i].innerText = trigDeg ? "DEG" : "RAD";
}

window.addEventListener("keydown", (e) => {
  console.log(e.key);

  if (e.key === "f") {
    let showFunc = document.getElementById("showFunc");
    showFunc.checked = !showFunc.checked;
  }

  let lookup = {
    p: "π",
    s: "sin",
    c: "cos",
    t: "tan",
    l: "ln",
    L: "log",
    S: "√",
    "*": "⨯",
    "-": "−",
    "/": "÷",
    // Every dead key works as exponentiation, aka jank
    Dead: "^",
    Enter: "=",
    Backspace: "←",
    ",": ".",
    i: "INV",
    r: "RAD",
  };
  handleClick(lookup[e.key] ? lookup[e.key] : e.key);
});

window.addEventListener("load", () => {
  let buttons = document.querySelectorAll(".tbutton button");
  for (let i = 0; i < buttons.length; i++) {
    // Arrow lambdas don't like the keyword this...
    buttons[i].addEventListener("click", function () {
      handleClick(this.textContent);
    });
  }
});
