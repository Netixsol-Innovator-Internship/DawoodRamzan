function markAsRead() {
  const ids = [
    { id: "webber", dot: "dot-webber" },
    { id: "gray", dot: "dot-gray" },
    { id: "Thompson", dot: "dot-thompson" },
    { id: "Hasanuddin", dot: "dot-hasanuddin" },
    { id: "smith", dot: "dot-smith" },
    { id: "Peterson", dot: "dot-peterson" },
    { id: "kim", dot: "dot-kim" },
  ];

  ids.forEach(({ id, dot }) => {
    const element = document.getElementById(id);
    if (element) {
      element.classList.remove("bg-notification-gradient");
      element.classList.add("bg-white");
      element.classList.add("read");

      const avatar = element.querySelector("img");
    }

    const dotElement = document.getElementById(dot);
    if (dotElement) {
      dotElement.style.display = "none";
    }
  });

  document.getElementById("n-count").textContent = "0";
}

function readNotification(id, dotId) {
  const element = document.getElementById(id);

  if (element && !element.classList.contains("read")) {
    element.classList.remove("bg-notification-gradient");
    element.classList.add("bg-white");
    element.classList.add("read");

    const countElement = document.getElementById("n-count");
    const current = +countElement.textContent;

    if (current > 0) {
      countElement.textContent = current - 1;
    }

    const dot = document.getElementById(dotId);
    if (dot) {
      dot.style.display = "none";
    }

    const avatar = element.querySelector("img");
  }
}
