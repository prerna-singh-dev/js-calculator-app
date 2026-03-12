// Fetching HTML input and error block
const inputVal = document.getElementById("inputVal");
const errorBlck = document.getElementById("error");
const btnBlock = document.querySelector(".btnBlock");
let result = "";

// Defined operands used (include both display symbols and JS operators for validation)
const operands = ["+", "÷", "/", "-", "x", "*", "%", "="];

// Map display symbols to JS operators so eval() works (e.g. ÷ → /, x or × → *)
function toJsExpression(displayStr) {
  return displayStr.replace(/÷/g, "/").replace(/×/g, "*").replace(/x/g, "*");
}

function clearError() {
  errorBlck.style.display = "none";
  errorBlck.innerHTML = "";
  inputVal.setAttribute("aria-invalid", "false");
}

function showError(message) {
  errorBlck.innerHTML = message;
  errorBlck.style.display = "inline-block";
  inputVal.setAttribute("aria-invalid", "true");
}

// Appending values in calculator display and performing operations
function appendInput(dispValue) {
  const inputLength = inputVal.value.length;

  try {
    if (inputLength === 0 && (operands.includes(dispValue) || dispValue === ")")) {
      inputVal.value = "";
      throw new Error("Invalid input");
    }

    if (dispValue === ".") {
      const parts = inputVal.value.split(/[+\-*/÷x×]/);
      const lastNumber = (parts[parts.length - 1] || "").trim();
      if (lastNumber.includes(".")) return;
      inputVal.value += ".";
      clearError();
      return;
    }

    if (dispValue === "=") {
      if (inputVal.value.trim() === "") {
        throw new Error("Empty input");
      }
      result = eval(toJsExpression(inputVal.value));
      if (result !== Infinity && !isNaN(result)) {
        inputVal.value = result;
      } else {
        throw new Error("Can't divide by zero");
      }
      clearError();
      return;
    }

    if (/^0[0-9]/.test(inputVal.value)) {
      inputVal.value = inputVal.value.replace(/^0+/, "");
    }
    inputVal.value += dispValue;
    clearError();
  } catch (err) {
    showError(err.message);
    inputVal.value = "";
  }
}

btnBlock.addEventListener("click", function (e) {
  const btn = e.target.closest("button");
  if (!btn) return;

  const targetClassList = btn.classList;
  const targetTextContent = btn.textContent.trim();

  if (targetClassList.contains("clearInput")) {
    inputVal.value = "";
    result = 0;
    clearError();
  } else if (
    targetClassList.contains("operands") ||
    targetClassList.contains("numBtn")
  ) {
    appendInput(targetTextContent);
  }
});
