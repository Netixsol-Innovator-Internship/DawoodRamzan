document.addEventListener("DOMContentLoaded", function () {
  const billInput = document.getElementById("billAmount");
  const customTipInput = document.getElementById("customTip");
  const peopleInput = document.getElementById("peopleCount");
  const tipButtons = document.querySelectorAll(".tip-btn");
  const tipAmountDisplay = document.getElementById("tipAmount");
  const totalDisplay = document.getElementById("totalAmount");
  const resetButton = document.getElementById("resetBtn");
  const peopleError = document.getElementById("peopleError");

  let selectedTip = 15;
  let isCustomTip = false;

  function calculate() {
    const bill = parseFloat(billInput.value) || 0;
    const people = parseInt(peopleInput.value) || 0;

    if (people === 0) {
      peopleInput.classList.add("border", "border-red-500");
      peopleError.classList.remove("hidden");
      resetButton.disabled = false;
      return;
    } else {
      peopleInput.classList.remove("border", "border-red-500");
      peopleError.classList.add("hidden");
    }

    const tipPerPerson = (bill * selectedTip) / 100 / people;
    const totalPerPerson = (bill + (bill * selectedTip) / 100) / people;

    tipAmountDisplay.textContent = `$${tipPerPerson.toFixed(2)}`;
    totalDisplay.textContent = `$${totalPerPerson.toFixed(2)}`;

    resetButton.disabled = !(
      billInput.value ||
      customTipInput.value ||
      peopleInput.value
    );
  }

  tipButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tipButtons.forEach((btn) => {
        btn.classList.remove("bg-[#26C2AE]");
        btn.classList.add("bg-[#00474B]");
      });

      button.classList.remove("bg-[#00474B]");
      button.classList.add("bg-[#26C2AE]");

      selectedTip = parseInt(button.dataset.tip);
      customTipInput.value = "";
      isCustomTip = false;

      calculate();
    });
  });

  customTipInput.addEventListener("input", () => {
    tipButtons.forEach((btn) => {
      btn.classList.remove("bg-[#26C2AE]");
      btn.classList.add("bg-[#00474B]");
    });

    selectedTip = parseFloat(customTipInput.value) || 0;
    isCustomTip = true;

    calculate();
  });

  [billInput, peopleInput].forEach((input) => {
    input.addEventListener("input", () => {
      if (parseFloat(input.value) < 0) {
        input.value = "";
      }
      calculate();
    });
  });

  resetButton.addEventListener("click", () => {
    billInput.value = "";
    customTipInput.value = "";
    peopleInput.value = "";

    selectedTip = 15;
    isCustomTip = false;

    tipButtons.forEach((btn) => {
      btn.classList.remove("bg-[#26C2AE]");
      btn.classList.add("bg-[#00474B]");
    });
    document
      .querySelector('.tip-btn[data-tip="15"]')
      .classList.remove("bg-[#00474B]");
    document
      .querySelector('.tip-btn[data-tip="15"]')
      .classList.add("bg-[#26C2AE]");

    tipAmountDisplay.textContent = "$0.00";
    totalDisplay.textContent = "$0.00";
    resetButton.disabled = true;
    peopleInput.classList.remove("border", "border-red-500");
    peopleError.classList.add("hidden");
  });

  calculate();
});
