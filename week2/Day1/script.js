const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function validateDate(day, month, year) {
  let isValid = true;
  document.getElementById("dayError").classList.add("hidden");
  document.getElementById("monthError").classList.add("hidden");
  document.getElementById("yearError").classList.add("hidden");
  if (isNaN(day)) {
    document.getElementById("dayError").textContent = "This field is required";
    document.getElementById("dayError").classList.remove("hidden");
    isValid = false;
  }
  if (isNaN(month)) {
    document.getElementById("monthError").textContent =
      "This field is required";
    document.getElementById("monthError").classList.remove("hidden");

    isValid = false;
  }
  if (isNaN(year)) {
    document.getElementById("yearError").textContent = "This field is required";
    document.getElementById("yearError").classList.remove("hidden");
    isValid = false;
  }
  if (!isValid) return false;

  if (month < 1 || month > 12) {
    document.getElementById("monthError").textContent = "Must be a valid month";
    document.getElementById("monthError").classList.remove("hidden");
    isValid = false;
  }

  if (year > new Date().getFullYear()) {
    document.getElementById("yearError").textContent = "Must be in the past";
    document.getElementById("yearError").classList.remove("hidden");
    isValid = false;
  }

  // Day validation based on month and year
  const maxDays = month === 2 && leapYear(year) ? 29 : months[month - 1];
  if (day < 1 || day > maxDays) {
    document.getElementById("dayError").textContent = "Must be a valid day";
    document.getElementById("dayError").classList.remove("hidden");
    isValid = false;
  }

  return isValid;
}

function calculateDate() {
  const inputDay = document.getElementById("day").value;
  const inputMonth = document.getElementById("month").value;
  const inputYear = document.getElementById("year").value;

  const day = parseInt(inputDay, 10);
  const month = parseInt(inputMonth, 10);
  const year = parseInt(inputYear, 10);

  if (!validateDate(day, month, year)) {
    displayResult("--", "--", "--");
    alert("Not valid input");
    return;
  }

  leapYear(year);
  ageCalculate(day, month, year);
}

function ageCalculate(day, month, year) {
  document.getElementById("explain").hidden = false;

  let today = new Date();
  let inputDate = new Date(year, month - 1, day);

  if (inputDate > today) {
    document.getElementById("dayError").textContent = "Must be in the past";
    document.getElementById("dayError").classList.remove("hidden");
    displayResult("--", "--", "--");
    return;
  }

  let outMonth, outDate, outYear;
  let currentYear = today.getFullYear();
  let currentMonth = today.getMonth() + 1;
  let currentDate = today.getDate();

  outYear = currentYear - year;

  if (currentMonth < month) {
    outYear--;
    outMonth = 12 - month + currentMonth;
  } else {
    outMonth = currentMonth - month;
  }

  if (currentDate >= day) {
    outDate = currentDate - day;
  } else {
    let daysInLastMonth = new Date(currentYear, currentMonth - 1, 0).getDate();
    outDate = daysInLastMonth + currentDate - day;
    if (outMonth === 0) {
      outMonth = 11;
      outYear--;
    } else {
      outMonth--;
    }
  }
  displayResult(outDate, outMonth, outYear);
  animateValue("newYear", 0, outYear, 1000);
  animateValue("newMonth", 0, outMonth, 1000);
  animateValue("newDay", 0, outDate, 1000);
}

function displayResult(bDate, bMonth, bYear) {
  document.getElementById("newYear").textContent = bYear;
  document.getElementById("newMonth").textContent = bMonth;
  document.getElementById("newDay").textContent = bDate;
}

function leapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function animateValue(id, start, end, duration) {
  const obj = document.getElementById(id);
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    obj.textContent = value;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

const container = document.getElementById("explanationContainer");

function showExplanation() {
  const para = document.createElement("p");
  para.innerHTML = `
  <strong>Initial Year Difference:</strong><br>
  <code>Years = Y₂ - Y₁</code><br><br>
  
  <strong>Adjust Year and Month if Current Month &lt; Birth Month:</strong><br>
  <code>if (M₂ &lt; M₁):</code><br>
  <code>&nbsp;&nbsp;Years -= 1</code><br>
  <code>&nbsp;&nbsp;Months = 12 - M₁ + M₂</code><br>
  <code>else:</code><br>
  <code>&nbsp;&nbsp;Months = M₂ - M₁</code><br><br>
  
  <strong>Adjust Month and Day if Current Day &lt; Birth Day:</strong><br>
  <code>if (D₂ &lt; D₁):</code><br>
  <code>&nbsp;&nbsp;DaysInPreviousMonth = daysInMonth(Y₂, M₂ - 1)</code><br>
  <code>&nbsp;&nbsp;Days = DaysInPreviousMonth + D₂ - D₁</code><br>
  <code>&nbsp;&nbsp;if (Months == 0):</code><br>
  <code>&nbsp;&nbsp;&nbsp;&nbsp;Months = 11</code><br>
  <code>&nbsp;&nbsp;&nbsp;&nbsp;Years -= 1</code><br>
  <code>&nbsp;&nbsp;else:</code><br>
  <code>&nbsp;&nbsp;&nbsp;&nbsp;Months -= 1</code><br>
  <code>else:</code><br>
  <code>&nbsp;&nbsp;Days = D₂ - D₁</code>
  `;

  container.hidden = false;

  container.innerHTML = ""; // Clear previous content
  container.appendChild(para);
  document.getElementById("result").hidden = true;
  document.getElementById("cross").hidden = false;
  document.getElementById("explain").hidden = true;
}
document.getElementById("result").hidden = false;
document.getElementById("explain").hidden = true;
document.getElementById("cross").hidden = true;

function cross() {
  document.getElementById("result").hidden = false;
  container.hidden = true;
  document.getElementById("cross").hidden = true;
  document.getElementById("explain").hidden = false;
}
