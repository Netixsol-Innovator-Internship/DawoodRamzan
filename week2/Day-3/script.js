const burgerItems = [
  {
    id: "b1",
    title: "Royal Cheese Burger with extra Fries",
    description:
      "1 McChicken®, 1 Big Mac®, 1 Royal Cheeseburger, 2 medium French Fries",
    price: "23.10",
    image: "./assets/burgers/b1.png",
  },
  {
    id: "b2",
    title: "The classics for 3",
    description:
      "1 McChicken®, 1 Big Mac®, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
    price: "23.10",
    image: "./assets/burgers/b2.png",
  },
  {
    id: "b3",
    title: "The classics for 3",
    description:
      "1 McChicken®, 1 Big Mac®, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
    price: "23.10",
    image: "./assets/burgers/b3.png",
  },
  {
    id: "b4",
    title: "The classics for 3",
    description:
      "1 McChicken®, 1 Big Mac®, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
    price: "23.10",
    image: "./assets/burgers/b4.png",
  },
  {
    id: "b5",
    title: "The classics for 3",
    description:
      "1 McChicken®, 1 Big Mac®, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
    price: "23.10",
    image: "./assets/burgers/b5.png",
  },
  {
    id: "b6",
    title: "The classics for 3",
    description:
      "1 McChicken®, 1 Big Mac®, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
    price: "23.10",
    image: "./assets/burgers/b6.png",
  },
];

const burgerContainer = document.getElementById("Burgers");

burgerItems.forEach((item) => {
  const card = document.createElement("div");
  card.className =
    "bg-white shadow-md rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center justify-between shadow-xl";

  const safeTitleB = item.title.replace(/'/g, "\\'");
  const safePriceB = item.price.replace(/'/g, "\\'");
  const safeImageB = item.image.replace(/'/g, "\\'");

  card.innerHTML = `
      <div class="flex flex-col gap-2 sm:gap-3 md:gap-4 max-w-[55%] sm:max-w-[60%] lg:w-[496px] lg:h-[245px]">
        <h2 class="font-semibold text-sm sm:text-base md:text-lg lg:text-xl">${item.title}</h2>
        <p class="text-gray-600 text-xs sm:text-sm">${item.description}</p>
        <span class="font-bold text-sm sm:text-base md:text-lg text-black">GBP ${item.price}</span>
      </div>
      <div class="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 flex-shrink-0">
        <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover rounded-lg" />
        <button onclick="cartAdd('${item.id}','${safeTitleB}', '${safePriceB}', '${safeImageB}')"
          class="absolute bottom-0 right-0 left-[4rem] sm:left-[5rem] md:left-[6rem] top-[4rem] sm:top-[5rem] md:top-[6rem] rounded-lg sm:rounded-xl w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex bg-white
          items-center justify-center border-[0.5rem] sm:border-[1rem] border-white">
          <img src="./assets/plus.png" class="w-8 h-8 sm:w-10 sm:h-10">
        </button>
      </div>
    `;

  burgerContainer.appendChild(card);
});

const friesItems = [
  {
    id: "f1",
    title: "Royal Cheese Burger with extra Fries",
    description:
      "1 McChicken®, 1 Big Mac®, 1 Royal Cheeseburger, 2 medium French Fries",
    price: "23.10",
    image: "./assets/fries/f2.png",
  },
  {
    id: "f2",
    title: "The classics for 3",
    description:
      "1 McChicken®, 1 Big Mac®, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
    price: "23.10",
    image: "./assets/fries/f2.png",
  },
  {
    id: "f3",
    title: "The classics for 3",
    description:
      "1 McChicken®, 1 Big Mac®, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
    price: "23.10",
    image: "./assets/fries/f2.png",
  },
  {
    id: "f4",
    title: "The classics for 3",
    description:
      "1 McChicken®, 1 Big Mac®, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
    price: "23.10",
    image: "./assets/fries/f1.png",
  },
  {
    id: "f5",
    title: "The classics for 3",
    description:
      "1 McChicken®, 1 Big Mac®, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
    price: "23.10",
    image: "./assets/fries/f1.png",
  },
  {
    id: "f6",
    title: "The classics for 3",
    description:
      "1 McChicken®, 1 Big Mac®, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
    price: "23.10",
    image: "./assets/fries/f1.png",
  },
];

const friesContainer = document.getElementById("Fries");

friesItems.forEach((item) => {
  const card = document.createElement("div");
  card.className =
    "bg-white shadow-md rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center justify-between shadow-xl";
  const safeTitleF = item.title.replace(/'/g, "\\'");
  const safePriceF = item.price.replace(/'/g, "\\'");
  const safeImageF = item.image.replace(/'/g, "\\'");
  card.innerHTML = `
      <div class="flex flex-col gap-2 sm:gap-3 md:gap-4 max-w-[55%] sm:max-w-[60%] lg:w-[496px] lg:h-[245px]">
        <h2 class="font-semibold text-sm sm:text-base md:text-lg lg:text-xl">${item.title}</h2>
        <p class="text-gray-600 text-xs sm:text-sm">${item.description}</p>
        <span class="font-bold text-sm sm:text-base md:text-lg text-black">GBP ${item.price}</span>
      </div>
      <div class="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 flex-shrink-0">
        <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover rounded-lg" />
        <button onclick="cartAdd('${item.id}','${safeTitleF}', '${safePriceF}', '${safeImageF}')"
          class="absolute bottom-0 right-0 left-[4rem] sm:left-[5rem] md:left-[6rem] top-[4rem] sm:top-[5rem] md:top-[6rem] rounded-lg sm:rounded-xl w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex bg-white
          items-center justify-center border-[0.5rem] sm:border-[1rem] border-white">
          <img src="./assets/plus.png" class="w-8 h-8 sm:w-10 sm:h-10">
        </button>
      </div>
    `;

  friesContainer.appendChild(card);
});

const coldItems = [
  {
    id: "c1",
    title: "Royal Cheese Burger with extra Fries",
    description:
      "1 McChicken®, 1 Big Mac®, 1 Royal Cheeseburger, 2 medium French Fries",
    price: "23.10",
    image: "./assets/cold/c1.png",
  },
  {
    id: "c2",
    title: "The classics for 3",
    description:
      "1 McChicken®, 1 Big Mac®, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
    price: "23.10",
    image: "./assets/cold/c2.png",
  },
  {
    id: "c3",
    title: "The classics for 3",
    description:
      "1 McChicken®, 1 Big Mac®, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
    price: "23.10",
    image: "./assets/cold/c3.png",
  },
  {
    id: "c4",
    title: "The classics for 3",
    description:
      "1 McChicken®, 1 Big Mac®, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
    price: "23.10",
    image: "./assets/cold/c4.png",
  },
  {
    id: "c5",
    title: "The classics for 3",
    description:
      "1 McChicken®, 1 Big Mac®, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
    price: "23.10",
    image: "./assets/cold/c5.png",
  },
  {
    id: "c6",
    title: "The classics for 3",
    description:
      "1 McChicken®, 1 Big Mac®, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks",
    price: "23.10",
    image: "./assets/cold/c3.png",
  },
];

const coldContainer = document.getElementById("cold");

coldItems.forEach((item) => {
  const card = document.createElement("div");
  card.className =
    "bg-white shadow-md rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center justify-between shadow-xl";

  const safeTitle = item.title.replace(/'/g, "\\'");
  const safePrice = item.price.replace(/'/g, "\\'");
  const safeImage = item.image.replace(/'/g, "\\'");

  card.innerHTML = `
      <div class="flex flex-col gap-2 sm:gap-3 md:gap-4 max-w-[55%] sm:max-w-[60%] lg:w-[496px] lg:h-[245px]">
        <h2 class="font-semibold text-sm sm:text-base md:text-lg lg:text-xl">${item.title}</h2>
        <p class="text-gray-600 text-xs sm:text-sm">${item.description}</p>
        <span class="font-bold text-sm sm:text-base md:text-lg text-black">GBP ${item.price}</span>
      </div>
      <div class="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 flex-shrink-0">
        <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover rounded-lg" />
        <button onclick="cartAdd('${item.id}','${safeTitle}', '${safePrice}', '${safeImage}')"
          class="absolute bottom-0 right-0 left-[4rem] sm:left-[5rem] md:left-[6rem] top-[4rem] sm:top-[5rem] md:top-[6rem] rounded-lg sm:rounded-xl w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex bg-white
          items-center justify-center border-[0.5rem] sm:border-[1rem] border-white">
          <img src="./assets/plus.png" class="w-8 h-8 sm:w-10 sm:h-10">
        </button>
      </div>
    `;

  coldContainer.appendChild(card);
});

var cart = 0;

function cartAdd(id, title, price, image) {
  const existingItem = orderItems.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
    cart++;
  } else {
    orderItems.push({
      id: id,
      name: title,
      quantity: 1,
      discount: "0",
      price: price,
      image: image,
    });
    cart++;
  }

  document.getElementById("cn").textContent = ` (${cart})`;

  const cartIcon = document.querySelector(
    ".w-8.h-8.sm\\:w-10.sm\\:h-10.md\\:w-12.md\\:h-12"
  );
  cartIcon.classList.add("animate-bounce");
  setTimeout(() => {
    cartIcon.classList.remove("animate-bounce");
  }, 500);
}

const orderItems = [];

function createModal() {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.onclick = closeModal;

  const modal = document.createElement("div");
  modal.className = "modal-container  bg-white max-w-3xl";

  modal.innerHTML = `

  
  <div>
    <div class="absolute  right-0">
  <button onclick="closeModal()" class="text-gray-600 bg-[#FC8A06] rounded-full p-4 hover:text-red-500 text-2xl font-bold focus:outline-none">
    X
  </button>
</div>
      <img src="./assets/modal/p.png" class="w-full h-48" alt="Image" />
      
    </div>
    <div class="p-4">
      <div class="space-y-4 max-h-[60vh] overflow-y-auto" id="item-list">
        ${orderItems
          .map(
            (item, index) => `
          <div class="flex justify-between bg-gray-200 hover:bg-[#03081F] hover:text-white items-center p-3 border-b" data-index="${index}">
            <div class="flex items-center space-x-3">
              <div class="rounded-full bg-gray-200 w-12 h-12 flex items-center justify-center">
                <img src="${item.image}" class="w-10 h-10 rounded-full object-cover" />
              </div>
              <div class="h-4 w-[1px] bg-black"></div>
              <div>
                <div class="font-medium">${item.name}</div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button class="quantity-btn bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center" data-action="decrease">-</button>
              <span class="quantity">${item.quantity}</span>
              <button class="quantity-btn bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center" data-action="increase">+</button>
            </div>
          </div>
        `
          )
          .join("")}
      </div>

      <!-- Order Summary -->
      <div class="mt-6 flex justify-between border-t pt-4">
        <div class="flex justify-between bg-[#FC8A06] w-48 rounded-xl p-3 font-bold text-lg">
          <span>Total to pay</span>
          <span id="total">£0.00</span>
        </div>
        <div class="text-sm text-gray-500 mt-2">
          Delivery & Tax will be calculated in the next step
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex space-x-4 mt-6">
        <button onclick="closeModal()" class="flex-1 py-3  hover:underline rounded-lg">
          Take me back
        </button>
        <button onclick="nextStep()" class="flex-1 py-3 bg-green-500 text-white rounded-lg">
          Next Step
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  updateTotal();

  modal.querySelectorAll(".quantity-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const action = this.getAttribute("data-action");
      const itemDiv = this.closest("[data-index]");
      const index = parseInt(itemDiv.getAttribute("data-index"));
      const quantityEl = itemDiv.querySelector(".quantity");

      if (action === "increase") {
        cart++;
        orderItems[index].quantity += 1;
        document.getElementById("cn").textContent = ` (${cart})`;
      } else if (action === "decrease" && orderItems[index].quantity > 0) {
        orderItems[index].quantity -= 1;
        console.log(orderItems[index].quantity);
        cart--;
        document.getElementById("cn").textContent = ` (${cart})`;
      }

      if (orderItems[index].quantity === 0) {
        orderItems.splice(index, 1);
        itemDiv.remove();
        if (orderItems.length === 0) {
          cart = 0;
          closeModal();
        }
        return;
      }

      quantityEl.textContent = orderItems[index].quantity;
      updateTotal();
    });
  });
}

function updateTotal() {
  let total = 0;
  orderItems.forEach((item) => {
    const itemPrice = parseFloat(item.price.replace(/[^\d.]/g, "")) || 0;
    total += item.quantity * itemPrice;
    console.log(`${item.id}`);
  });
  document.getElementById("total").textContent = `£${total.toFixed(2)}`;
}

function closeModal() {
  document.querySelector(".modal-overlay")?.remove();
  document.querySelector(".modal-container")?.remove();
}

function topup() {
  createModal();
}

function nextStep() {
  alert("Proceeding to next step...");
}

//---------------------------------------------------------------------------------------------------slider
document.addEventListener("DOMContentLoaded", function () {
  const reviews = [
    {
      name: "St Gk",
      location: "South London",
      date: "24th September, 2023",
      rating: 5,
      content:
        "The positive aspect was undoubtedly the efficiency of the service. The queue moved quickly, the staff was friendly, and the food was up to the usual McDonald's standard – hot and satisfying.",
    },
    {
      name: "Jane D",
      location: "Manchester",
      date: "15th October, 2023",
      rating: 4,
      content:
        "The positive aspect was undoubtedly the efficiency of the service. The queue moved quickly, the staff was friendly, and the food was up to the usual McDonald's standard – hot and satisfying.",
    },
    {
      name: "Mike T",
      location: "Birmingham",
      date: "5th November, 2023",
      rating: 5,
      content:
        "The positive aspect was undoubtedly the efficiency of the service. The queue moved quickly, the staff was friendly, and the food was up to the usual McDonald's standard – hot and satisfying.",
    },
    {
      name: "Sarah W",
      location: "Liverpool",
      date: "10th December, 2023",
      rating: 4,
      content:
        "The positive aspect was undoubtedly the efficiency of the service. The queue moved quickly, the staff was friendly, and the food was up to the usual McDonald's standard – hot and satisfying.",
    },
    {
      name: "David R",
      location: "Leeds",
      date: "20th December, 2023",
      rating: 5,
      content:
        "The positive aspect was undoubtedly the efficiency of the service. The queue moved quickly, the staff was friendly, and the food was up to the usual McDonald's standard – hot and satisfying.",
    },
  ];

  //-------------------------------slider----------

  const sliderContainer = document.getElementById("review-slider");
  const dotsContainer = document.getElementById("slider-dots");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  let currentSlide = 0;
  let cardsPerView = 1; // Default for mobile

  function updateCardsPerView() {
    if (window.innerWidth >= 1024) {
      cardsPerView = 3;
    } else if (window.innerWidth >= 768) {
      cardsPerView = 2;
    } else {
      cardsPerView = 1;
    }
  }

  function createSlide(review) {
    const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
    const slide = document.createElement("div");
    slide.className = "w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-2";
    slide.innerHTML = `
        <div class="bg-white p-4 sm:p-6 rounded-lg shadow-md h-full mx-auto">
          <div class="flex justify-between items-start mb-3 sm:mb-4">
            <div class="flex gap-2 sm:gap-4">
              <div>
                <img src="./assets/review.png" class="w-8 h-8 sm:w-10 sm:h-10 rounded-full"> 
              </div>
              <div class="h-10 sm:h-12 w-1 bg-[#f59e0b]"></div>
              <div>
                <h3 class="font-bold text-sm sm:text-base md:text-lg">${review.name}</h3>
                <p class="text-[#f59e0b] text-xs sm:text-sm">${review.location}</p>
              </div>
            </div>
  
            <!-- RIGHT SIDE: STARS + DATE -->
            <div class="flex flex-col items-end text-[#f59e0b] text-sm sm:text-base md:text-lg">
              <div>${stars}</div>
              <div class="flex text-gray-500 gap-1 sm:gap-2 text-xs sm:text-sm items-center">
                <img src="./assets/time.png" class="w-3 h-3 sm:w-4 sm:h-4" />
                <span>${review.date}</span>
              </div>
            </div>
          </div>
  
          <p class="text-gray-700 text-xs sm:text-sm mb-3 sm:mb-4">${review.content}</p>
        </div>
      `;
    return slide;
  }

  function renderSlides() {
    sliderContainer.innerHTML = "";
    reviews.forEach((review) => {
      sliderContainer.appendChild(createSlide(review));
    });
  }

  function updateSliderPosition() {
    const slideWidth = sliderContainer.querySelector("div").offsetWidth + 16; // 16 = gap
    const offset = currentSlide * slideWidth;
    sliderContainer.style.transform = `translateX(-${offset}px)`;
    updateDots();
  }

  function updateDots() {
    dotsContainer.innerHTML = "";
    const totalSlides = Math.max(reviews.length - cardsPerView + 1, 1);

    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("button");
      dot.className = `w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
        i === currentSlide ? "bg-[#FC8A06]" : "bg-gray-300"
      }`;
      dot.addEventListener("click", () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }
  function goToSlide(index) {
    const maxIndex = Math.max(reviews.length - cardsPerView, 0);

    if (index > maxIndex) {
      currentSlide = 0; // Cycle to first slide
    } else if (index < 0) {
      currentSlide = maxIndex; // Cycle to last slide
    } else {
      currentSlide = index;
    }

    updateSliderPosition();
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  // Initialize
  updateCardsPerView();
  renderSlides();
  updateSliderPosition();
  updateDots();

  // Event listeners
  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);

  // Handle window resize
  window.addEventListener("resize", () => {
    updateCardsPerView();
    updateSliderPosition();
  });
});

document
  .getElementById("mobile-menu-button")
  .addEventListener("click", function () {
    const menu = document.getElementById("mobile-menu");
    menu.classList.toggle("hidden");
  });
