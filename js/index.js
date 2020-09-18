function test(w) {
  let func = document.getElementById("functions");
  func.setAttribute("style", `width: ${w}%;`);
}

let stack = [],
  currentNum = "";
function handleClick(name) {
  switch (name) {
    // TODO: Fix % and ! support
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
      currentNum += name;
      break;
    case ".":
      console.log("Decimal");
      if (!currentNum.contains(".")) {
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
        if (name === "−" || name === ")") {
          stack.push(name);
        }
      } else {
        stack.push(currentNum, name);
        currentNum = "";
      }
      break;
    case "=":
      console.log("Eq");
      if (currentNum !== "") {
        stack.push(currentNum);
        currentNum = "";
      }
      let rpn = parseToRPN(stack);
      console.log(evalRPN(rpn));
      break;
    case "←":
      console.log("Back");
      if (currentNum === "") stack.pop();
      else currentNum = currentNum.slice(0, -1);
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
        stack.push(currentNum, "⨯", name);
        currentNum = "";
      } else {
        stack.push(name);
      }
      break;
  }

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
