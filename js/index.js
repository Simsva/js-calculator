function test(w) {
  let func = document.getElementById("functions");
  func.setAttribute("style", `width: ${w}%;`);
}

// Clears everything on back press when non-zero
// Decrements by one every button press (so when
// set to 2 it carries over to the next press)
let clearAll = 0;
let stack = [],
  currentNum = "";
function handleClick(name) {
  switch (name) {
    // TODO: Fix % and ! support
    // TODO: Add inverse functions
    // TODO: Clean up/separate code
    // Yes, really
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
      if (isNaN(currentNum) && currentNum !== "−") {
        stack.push(currentNum, "⨯");
        currentNum = "";
      }
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
      if (currentNum !== "") {
        stack.push(currentNum);
      }

      let result;
      try {
        // Replace some characters so the parser understands
        let correctedStack = stack
          .join(" ")
          .replace("÷", "/")
          .replace("⨯", "*")
          .replace("−", "-")
          .replace("√", "sqrt")
          .replace("π", "pi")
          .split(" ");
        console.log(correctedStack);
        let rpn = parseToRPN(correctedStack);
        console.log(rpn);
        result = evalRPN(rpn.reverse()).toString().replace("-", "−");
        console.log(result);
      } catch (e) {
        console.error(e);
      }

      if (result && result !== "NaN") {
        currentNum = result;
        stack = [];
        // Clear everything on next BACK press
        clearAll = 2;
      } else if (stack.length > 0 && stack[stack.length - 1].isNum()) {
        currentNum = stack.pop();
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
      }
      currentNum = name;
      break;
  }

  if (clearAll) clearAll--;

  let tmp = document.getElementById("answerField");
  tmp.innerHTML = stack.join("") + currentNum;
}

window.addEventListener("load", () => {
  let buttons = document.querySelectorAll(".tbutton button");
  for (let i = 0; i < buttons.length; i++) {
    // Arrow lambdas don't like the keyword this...
    buttons[i].addEventListener("click", function () {
      handleClick(this.textContent);
    });
  }
});
