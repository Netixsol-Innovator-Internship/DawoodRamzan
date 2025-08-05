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
      element.classList.remove(
        "bg-notification-gradient",
        "animate-gradient-pulse",
        "bg-[length:200%_100%]"
      );
      element.classList.add(
        "bg-white",
        "read",
        "transition-all",
        "duration-300"
      );
    }

    const dotElement = document.getElementById(dot);
    if (dotElement) {
      dotElement.classList.add("hidden");
    }
  });

  document.getElementById("n-count").textContent = "0";
}

function readNotification(id, dotId) {
  const element = document.getElementById(id);

  if (element && !element.classList.contains("read")) {
    element.classList.remove(
      "bg-notification-gradient",
      "animate-gradient-pulse",
      "bg-[length:200%_100%]"
    );
    element.classList.add("bg-white", "read", "transition-all", "duration-300");

    const countElement = document.getElementById("n-count");
    const current = +countElement.textContent;
    if (current > 0) countElement.textContent = current - 1;

    const dot = document.getElementById(dotId);
    if (dot) dot.classList.add("hidden");
  }
}
function readPara(id) {
  const para = document.getElementById(id);
  if (para) {
    para.classList.toggle("line-clamp-1");
  }
}
