function toggleMenu() {
  document.getElementById("mobile-menu").classList.toggle("hidden");
}

const quizzes = [
  {
    category: "General Knowledge",
    questions: [
      {
        question: "Which is the largest ocean in the world?",
        options: [
          "Atlantic Ocean",
          "Pacific Ocean",
          "Indian Ocean",
          "Arctic Ocean",
        ],
        answer: "Pacific Ocean",
      },
      {
        question: "Who is known as the Father of Computers?",
        options: [
          "Alan Turing",
          "Charles Babbage",
          "Bill Gates",
          "John von Neumann",
        ],
        answer: "Charles Babbage",
      },
      {
        question: "In which year did World War II end?",
        options: ["1945", "1944", "1939", "1950"],
        answer: "1945",
      },
      {
        question: "What is the capital of Australia?",
        options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
        answer: "Canberra",
      },
      {
        question: "Which currency is used in Japan?",
        options: ["Yuan", "Dollar", "Yen", "Won"],
        answer: "Yen",
      },
      {
        question: "Which is the smallest country in the world?",
        options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
        answer: "Vatican City",
      },
      {
        question: "Which language has the most native speakers?",
        options: ["English", "Mandarin", "Spanish", "Hindi"],
        answer: "Mandarin",
      },
      {
        question: "Which is the longest river in the world?",
        options: ["Nile", "Amazon", "Yangtze", "Mississippi"],
        answer: "Nile",
      },
      {
        question: "Which is the tallest mountain in the world?",
        options: ["K2", "Everest", "Kangchenjunga", "Makalu"],
        answer: "Everest",
      },
      {
        question: "What is the national flower of Pakistan?",
        options: ["Rose", "Tulip", "Jasmine", "Lily"],
        answer: "Jasmine",
      },
    ],
  },
  {
    category: "Science",
    questions: [
      {
        question: "What is the chemical symbol for water?",
        options: ["H", "O2", "H2O", "HO2"],
        answer: "H2O",
      },
      {
        question: "What planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        answer: "Mars",
      },
      {
        question: "Which gas do plants absorb from the atmosphere?",
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
        answer: "Carbon Dioxide",
      },
      {
        question: "What is the speed of light?",
        options: ["300,000 km/s", "150,000 km/s", "1,000 km/s", "3,000 km/s"],
        answer: "300,000 km/s",
      },
      {
        question: "Which part of the cell contains genetic material?",
        options: ["Cytoplasm", "Nucleus", "Mitochondria", "Ribosome"],
        answer: "Nucleus",
      },
      {
        question: "Which is the largest organ in the human body?",
        options: ["Heart", "Liver", "Skin", "Lungs"],
        answer: "Skin",
      },
      {
        question: "What is HCl commonly known as?",
        options: [
          "Sulfuric Acid",
          "Hydrochloric Acid",
          "Nitric Acid",
          "Acetic Acid",
        ],
        answer: "Hydrochloric Acid",
      },
      {
        question: "Which planet is closest to the Sun?",
        options: ["Venus", "Mercury", "Earth", "Mars"],
        answer: "Mercury",
      },
      {
        question: "What is the boiling point of water at sea level?",
        options: ["100°C", "90°C", "80°C", "120°C"],
        answer: "100°C",
      },
      {
        question: "What type of blood cells fight infection?",
        options: [
          "Red Blood Cells",
          "White Blood Cells",
          "Platelets",
          "Plasma",
        ],
        answer: "White Blood Cells",
      },
    ],
  },
  {
    category: "History",
    questions: [
      {
        question: "Who was the first President of the United States?",
        options: [
          "Thomas Jefferson",
          "George Washington",
          "Abraham Lincoln",
          "John Adams",
        ],
        answer: "George Washington",
      },
      {
        question: "When did the First World War begin?",
        options: ["1914", "1918", "1939", "1920"],
        answer: "1914",
      },
      {
        question: "Who discovered America?",
        options: [
          "Christopher Columbus",
          "Vasco da Gama",
          "Ferdinand Magellan",
          "Marco Polo",
        ],
        answer: "Christopher Columbus",
      },
      {
        question: "In which year was Pakistan founded?",
        options: ["1945", "1947", "1950", "1939"],
        answer: "1947",
      },
      {
        question: "Who was the founder of the Mughal Empire?",
        options: ["Akbar", "Babur", "Aurangzeb", "Humayun"],
        answer: "Babur",
      },
      {
        question: "Where did the Industrial Revolution begin?",
        options: ["USA", "France", "Germany", "Britain"],
        answer: "Britain",
      },
      {
        question: "Which wall divided Berlin from 1961 to 1989?",
        options: ["Great Wall", "Berlin Wall", "Iron Curtain", "Cold War Wall"],
        answer: "Berlin Wall",
      },
      {
        question: "Who was known as the Iron Lady?",
        options: [
          "Indira Gandhi",
          "Margaret Thatcher",
          "Angela Merkel",
          "Golda Meir",
        ],
        answer: "Margaret Thatcher",
      },
      {
        question: "Which empire built the Colosseum?",
        options: [
          "Roman Empire",
          "Greek Empire",
          "Ottoman Empire",
          "Persian Empire",
        ],
        answer: "Roman Empire",
      },
      {
        question: "When did the Titanic sink?",
        options: ["1912", "1915", "1905", "1920"],
        answer: "1912",
      },
    ],
  },
  {
    category: "Literature",
    questions: [
      {
        question: "Who wrote 'Hamlet'?",
        options: [
          "Charles Dickens",
          "William Shakespeare",
          "Jane Austen",
          "Mark Twain",
        ],
        answer: "William Shakespeare",
      },
      {
        question: "What is the first book of the Bible?",
        options: ["Exodus", "Genesis", "Psalms", "Matthew"],
        answer: "Genesis",
      },
      {
        question: "Who is the author of 'Pride and Prejudice'?",
        options: [
          "Charlotte Brontë",
          "Jane Austen",
          "Emily Brontë",
          "George Eliot",
        ],
        answer: "Jane Austen",
      },
      {
        question: "What is the longest novel ever written?",
        options: [
          "War and Peace",
          "In Search of Lost Time",
          "Les Misérables",
          "Don Quixote",
        ],
        answer: "In Search of Lost Time",
      },
      {
        question: "Who created Sherlock Holmes?",
        options: [
          "Agatha Christie",
          "Arthur Conan Doyle",
          "Jules Verne",
          "Ian Fleming",
        ],
        answer: "Arthur Conan Doyle",
      },
      {
        question: "What is the main language of the 'Harry Potter' series?",
        options: ["Spanish", "English", "French", "German"],
        answer: "English",
      },
      {
        question: "Who wrote 'The Odyssey'?",
        options: ["Homer", "Virgil", "Sophocles", "Plato"],
        answer: "Homer",
      },
      {
        question: "Which novel starts with 'Call me Ishmael'?",
        options: [
          "Moby Dick",
          "The Old Man and the Sea",
          "The Great Gatsby",
          "Robinson Crusoe",
        ],
        answer: "Moby Dick",
      },
      {
        question: "What is the genre of 'The Hobbit'?",
        options: ["Science Fiction", "Fantasy", "Romance", "Drama"],
        answer: "Fantasy",
      },
      {
        question: "Who wrote 'Animal Farm'?",
        options: [
          "George Orwell",
          "Aldous Huxley",
          "Ernest Hemingway",
          "F. Scott Fitzgerald",
        ],
        answer: "George Orwell",
      },
    ],
  },
  {
    category: "Mathematics",
    questions: [
      {
        question: "What is 7 × 8?",
        options: ["54", "56", "58", "60"],
        answer: "56",
      },
      {
        question: "What is the square root of 81?",
        options: ["8", "9", "10", "7"],
        answer: "9",
      },
      {
        question: "What is 12 ÷ 4?",
        options: ["2", "3", "4", "5"],
        answer: "3",
      },
      {
        question: "What is 5²?",
        options: ["10", "20", "25", "30"],
        answer: "25",
      },
      {
        question: "What is 15% of 200?",
        options: ["25", "30", "35", "40"],
        answer: "30",
      },
      {
        question: "What is 0.5 × 0.2?",
        options: ["0.01", "0.1", "0.5", "1"],
        answer: "0.1",
      },
      {
        question: "What is the value of π (approx)?",
        options: ["2.14", "3.14", "4.14", "5.14"],
        answer: "3.14",
      },
      {
        question: "What is 100 ÷ 5?",
        options: ["15", "20", "25", "30"],
        answer: "20",
      },
      {
        question: "What is 45 + 55?",
        options: ["90", "100", "110", "120"],
        answer: "100",
      },
      {
        question: "What is 144 ÷ 12?",
        options: ["10", "11", "12", "13"],
        answer: "12",
      },
    ],
  },
  {
    category: "Geography",
    questions: [
      {
        question: "What is the capital of France?",
        options: ["London", "Paris", "Rome", "Madrid"],
        answer: "Paris",
      },
      {
        question: "Which continent is the Sahara Desert located in?",
        options: ["Asia", "Africa", "Australia", "South America"],
        answer: "Africa",
      },
      {
        question: "What is the largest country by area?",
        options: ["USA", "China", "Russia", "Canada"],
        answer: "Russia",
      },
      {
        question: "Which country has the most population?",
        options: ["India", "China", "USA", "Indonesia"],
        answer: "China",
      },
      {
        question: "What is the capital of Canada?",
        options: ["Toronto", "Vancouver", "Ottawa", "Montreal"],
        answer: "Ottawa",
      },
      {
        question: "Which river flows through Egypt?",
        options: ["Amazon", "Nile", "Danube", "Ganges"],
        answer: "Nile",
      },
      {
        question: "Which is the smallest continent?",
        options: ["Europe", "Australia", "Antarctica", "South America"],
        answer: "Australia",
      },
      {
        question: "Which ocean is to the east of Africa?",
        options: ["Atlantic", "Indian", "Pacific", "Southern"],
        answer: "Indian",
      },
      {
        question: "What is the capital of Italy?",
        options: ["Milan", "Rome", "Venice", "Florence"],
        answer: "Rome",
      },
      {
        question: "Which country is called the Land of the Rising Sun?",
        options: ["China", "Japan", "Thailand", "Vietnam"],
        answer: "Japan",
      },
    ],
  },
  {
    category: "Sports",
    questions: [
      {
        question: "How many players are on a football (soccer) team?",
        options: ["9", "10", "11", "12"],
        answer: "11",
      },
      {
        question: "Which sport uses a shuttlecock?",
        options: ["Tennis", "Badminton", "Squash", "Table Tennis"],
        answer: "Badminton",
      },
      {
        question: "How many rings are there in the Olympic logo?",
        options: ["4", "5", "6", "7"],
        answer: "5",
      },
      {
        question: "In which sport would you perform a slam dunk?",
        options: ["Football", "Basketball", "Volleyball", "Rugby"],
        answer: "Basketball",
      },
      {
        question: "What is the national sport of Pakistan?",
        options: ["Cricket", "Hockey", "Football", "Squash"],
        answer: "Hockey",
      },
      {
        question: "How many players are on a cricket team?",
        options: ["10", "11", "12", "13"],
        answer: "11",
      },
      {
        question: "Which country hosts Wimbledon?",
        options: ["USA", "Australia", "France", "UK"],
        answer: "UK",
      },
      {
        question: "Which sport is known as 'The Gentleman's Game'?",
        options: ["Football", "Cricket", "Tennis", "Golf"],
        answer: "Cricket",
      },
      {
        question: "How long is an Olympic swimming pool?",
        options: ["25m", "50m", "75m", "100m"],
        answer: "50m",
      },
      {
        question: "Which country won the FIFA World Cup in 2018?",
        options: ["Brazil", "France", "Germany", "Argentina"],
        answer: "France",
      },
    ],
  },
  {
    category: "Technology",
    questions: [
      {
        question: "What does CPU stand for?",
        options: [
          "Central Process Unit",
          "Central Processing Unit",
          "Computer Personal Unit",
          "Central Peripheral Unit",
        ],
        answer: "Central Processing Unit",
      },
      {
        question: "Which company developed the iPhone?",
        options: ["Google", "Apple", "Microsoft", "Samsung"],
        answer: "Apple",
      },
      {
        question: "What does HTTP stand for?",
        options: [
          "Hyper Transfer Text Protocol",
          "Hypertext Transfer Protocol",
          "High Transfer Text Protocol",
          "Hyper Transfer Tech Protocol",
        ],
        answer: "Hypertext Transfer Protocol",
      },
      {
        question: "Which programming language is used for Android apps?",
        options: ["Java", "Swift", "C#", "Kotlin"],
        answer: "Java",
      },
      {
        question: "Who founded Microsoft?",
        options: ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Elon Musk"],
        answer: "Bill Gates",
      },
      {
        question: "What does AI stand for?",
        options: [
          "Automatic Input",
          "Artificial Intelligence",
          "Applied Intelligence",
          "Advanced Interface",
        ],
        answer: "Artificial Intelligence",
      },
      {
        question: "Which company created Windows OS?",
        options: ["Apple", "Google", "Microsoft", "IBM"],
        answer: "Microsoft",
      },
      {
        question: "What does USB stand for?",
        options: [
          "Universal Serial Bus",
          "Universal System Board",
          "United Serial Bus",
          "Uniform System Bus",
        ],
        answer: "Universal Serial Bus",
      },
      {
        question: "What is the full form of HTML?",
        options: [
          "Hyper Transfer Markup Language",
          "Hypertext Markup Language",
          "High Text Markup Language",
          "Hyper Tool Markup Language",
        ],
        answer: "Hypertext Markup Language",
      },
      {
        question: "Which social media platform is owned by Meta?",
        options: ["Twitter", "Instagram", "Snapchat", "TikTok"],
        answer: "Instagram",
      },
    ],
  },
];

let quizTimer;
let category; // This should already be declared for the quiz functionality
let timeLeft = 600; // 10 minutes in seconds
const hoursDisplay = document.getElementById("hours");
const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");

//==========================================================login and signup=============================

// Add this near the top with other utility functions
function setCurrentUser(email) {
  localStorage.setItem("currentUser", email);
}

function leader() {
  document.getElementById("leaderboard").classList.remove("hidden");

  document.getElementById("home").classList.add("hidden");
  document.getElementById("signup-form").classList.add("hidden");
  document.getElementById("login-form").classList.add("hidden");
  document.getElementById("AllQuiz").classList.add("hidden");
  document.getElementById("single-quiz").classList.add("hidden");
  document.getElementById("quiz-result").classList.add("hidden");
  document.getElementById("quiz-review").classList.add("hidden");
  document.getElementById("Profile").classList.add("hidden");
}

function getCurrentUser() {
  return localStorage.getItem("currentUser");
}

function clearCurrentUser() {
  localStorage.removeItem("currentUser");
}

// Load users from localStorage if available, otherwise use the default array
let users = JSON.parse(localStorage.getItem("users")) || [
  {
    full_name: "Dawood Ramzan",
    password: "P@ssw0rd123",
    email: "dawood.ramzan@example.com",
    bio: "Passionate web developer specializing in MERN stack applications with a focus on clean, efficient, and scalable code.",
    date_joined: "2025-08-08",
  },
];

function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

function login(event) {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    alert(`Welcome back, ${user.full_name}!`);
    setCurrentUser(email); // Store the logged-in user
    document.getElementById("login-form").classList.add("hidden");
    document.getElementById("AllQuiz").classList.remove("hidden");
  } else {
    alert("Invalid username or password.");
  }
}
function signup(event) {
  event.preventDefault();
  const full_name = document.getElementById("full_name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const bio = "New quiz enthusiast"; // Default bio
  const date_joined = new Date().toISOString().split("T")[0];

  if (users.find((u) => u.email === email)) {
    alert("User already exists with this email.");
    return;
  }

  const newUser = { full_name, email, password, bio, date_joined };
  users.push(newUser);
  saveUsers();

  // Log in the new user automatically
  setCurrentUser(email);

  alert(`Welcome, ${newUser.full_name}! Your account has been created.`);
  AllQuizNav();
  document.getElementById("signup-form").classList.add("hidden");
}

function AllQuizNav() {
  document.getElementById("home").classList.add("hidden");
  document.getElementById("AllQuiz").classList.remove("hidden");
  document.getElementById("leaderboard").classList.add("hidden");
}

function moveToSignup() {
  document.getElementById("home").classList.add("hidden");
  document.getElementById("signup-form").classList.remove("hidden");
  document.getElementById("leaderboard").classList.add("hidden");
}

function showLogin() {
  document.getElementById("signup-form").classList.add("hidden");
  document.getElementById("login-form").classList.remove("hidden");
  document.getElementById("leaderboard").classList.add("hidden");
}
function showsignupfromLogin() {
  document.getElementById("login-form").classList.add("hidden");

  document.getElementById("signup-form").classList.remove("hidden");
  document.getElementById("leaderboard").classList.add("hidden");
}

//==================================================profile=================================================================================
function showProfile() {
  const currentUserEmail = getCurrentUser();
  if (!currentUserEmail) {
    alert("Please login first by clicking get started to view your profile.");
    return;
  }

  const currentUser = users.find((u) => u.email === currentUserEmail);
  if (currentUser) {
    displayProfile(currentUser);
    AllProfileNav();
  } else {
    alert("User not found. Please login again.");
    document.getElementById("login-form").classList.remove("hidden");
  }
}

// Create a function to display the profile
function displayProfile(user) {
  const profileContainer = document.getElementById("profile-container");

  // Get quiz history from localStorage or create empty array
  let quizHistory = JSON.parse(localStorage.getItem("quizHistory")) || [];
  // Filter only this user's quiz history
  const userQuizHistory = quizHistory.filter((q) => q.email === user.email);

  if (!user) {
    profileContainer.innerHTML = `<p class="text-center text-red-500">User information not available</p>`;
    return;
  }

  profileContainer.innerHTML = `
    <div class="flex flex-col items-center text-center mb-8">
      <img src="./assets/pic.png" alt="Profile Image" class="w-24 h-24 rounded-full mb-4">
      <h2 class="text-xl font-bold">${user.full_name}</h2>
      <p class="text-gray-500">Quiz Enthusiast</p>
      <p class="text-gray-400 text-sm">Joined ${user.date_joined}</p>
    </div>

    <div class="flex justify-center border-b border-gray-200 mb-6">
      <button class="px-4 py-2 text-blue-500 border-b-2 border-blue-500 font-medium">Activity</button>
      <button onclick="logout()" class="px-4 py-2 text-gray-500 hover:text-blue-500">Logout</button>
    </div>

    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-4">Personal Information</h3>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p class="font-medium">Name</p>
          <p class="text-gray-600">${user.full_name}</p>
        </div>
        <div>
          <p class="font-medium">Email</p>
          <p class="text-gray-600">${user.email}</p>
        </div>
        <div class="col-span-2">
          <p class="font-medium">Bio</p>
          <p class="text-gray-600">${user.bio}</p>
        </div>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-4">Quiz History</h3>
      ${
        userQuizHistory.length > 0
          ? `<table class="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead class="bg-gray-100">
                <tr>
                  <th class="text-left py-2 px-4">Quiz Name</th>
                  <th class="text-left py-2 px-4">Score</th>
                  <th class="text-left py-2 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                ${userQuizHistory
                  .map(
                    (quiz) => `
                  <tr class="border-t">
                    <td class="py-2 px-4">${quiz.category}</td>
                    <td class="py-2 px-4">${quiz.score}/${quiz.total}</td>
                    <td class="py-2 px-4">${quiz.date}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>`
          : `<p class="text-center text-gray-600">No quiz history yet. Take a quiz to see your results here!</p>`
      }
    </div>
  `;
}
function AllProfileNav() {
  document.getElementById("Profile").classList.remove("hidden");

  document.getElementById("home").classList.add("hidden");
  document.getElementById("signup-form").classList.add("hidden");
  document.getElementById("login-form").classList.add("hidden");
  document.getElementById("AllQuiz").classList.add("hidden");
  document.getElementById("single-quiz").classList.add("hidden");
  document.getElementById("quiz-result").classList.add("hidden");
  document.getElementById("quiz-review").classList.add("hidden");
  document.getElementById("leaderboard").classList.add("hidden");
}

function AllQuizNav() {
  document.getElementById("home").classList.add("hidden");
  document.getElementById("leaderboard").classList.add("hidden");
  document.getElementById("signup-form").classList.add("hidden");
  document.getElementById("login-form").classList.add("hidden");
  document.getElementById("AllQuiz").classList.remove("hidden");
  document.getElementById("single-quiz").classList.add("hidden");
  document.getElementById("quiz-result").classList.add("hidden");
  document.getElementById("quiz-review").classList.add("hidden");
  document.getElementById("Profile").classList.add("hidden");
}
function singleQuiz(category1) {
  category = category1;
  const quiz = quizzes.find((q) => q.category === category);

  if (quiz) {
    document.getElementById("quiz-title").textContent = category + " Quiz";
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = ""; // Clear previous questions

    // Assuming quiz.questions contains your questions array
    let currentQuestionIndex = 0;
    const progressBar = document.getElementById("progress-bar");
    const nextButton = document.getElementById("next-button");

    // Create and append progress bar container if it doesn't exist
    if (!progressBar) {
      const progressContainer = document.createElement("div");
      progressContainer.classList.add(
        "w-full",
        "bg-gray-200",
        "rounded-full",
        "h-2.5",
        "mb-4"
      );
      progressContainer.innerHTML = `
    <div id="progress-bar" class="bg-blue-600 h-2.5 rounded-full" style="width: 0%"></div>
  `;
      quizContainer.parentNode.insertBefore(progressContainer, quizContainer);
    }

    function showQuestion(index) {
      // Clear previous question
      quizContainer.innerHTML = "";

      // Update progress bar
      const progress = ((index + 1) / quiz.questions.length) * 100;
      document.getElementById("progress-bar").style.width = `${progress}%`;

      // Show current question
      const q = quiz.questions[index];
      const questionEl = document.createElement("div");
      questionEl.classList.add("p-4", "bg-gray-50", "rounded-lg", "shadow");

      questionEl.innerHTML = `
    <h2 class="font-semibold mb-3">${index + 1}. ${q.question}</h2>
    <div class="space-y-2">
      ${q.options
        .map(
          (option) => `
        <label class="flex items-center space-x-2">
          <input type="radio" name="q${index}" value="${option}" class="text-blue-600">
          <span>${option}</span>
        </label>
      `
        )
        .join("")}
    </div>
  `;
      quizContainer.appendChild(questionEl);

      // Update next button text or hide if last question
      if (index === quiz.questions.length - 1) {
        nextButton.textContent = "Submit";
      } else {
        nextButton.textContent = "Next";
      }
    }

    // Initialize next button if it doesn't exist
    if (!nextButton) {
      const button = document.createElement("button");
      button.id = "next-button";
      button.classList.add(
        "mt-4",
        "px-4",
        "py-2",
        "bg-blue-600",
        "text-white",
        "rounded",
        "hover:bg-blue-700"
      );
      button.textContent = "Next";
      button.addEventListener("click", () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
          currentQuestionIndex++;
          showQuestion(currentQuestionIndex);
        } else {
          // Handle quiz submission
          alert("Quiz submitted!");
        }
      });
      quizContainer.parentNode.appendChild(button);
    }

    // Show first question initially
    showQuestion(0);
    // Show single quiz and hide others
    document.getElementById("AllQuiz").classList.add("hidden");
    document.getElementById("single-quiz").classList.remove("hidden");
    document.getElementById("quiz-result").classList.add("hidden");
    document.getElementById("quiz-review").classList.add("hidden");

    // Start the timer
    startTimer();
  }
}
function logout() {
  clearCurrentUser();
  document.getElementById("home").classList.remove("hidden");
  document.getElementById("signup-form").classList.add("hidden");
  document.getElementById("login-form").classList.add("hidden");
  document.getElementById("AllQuiz").classList.add("hidden");
  document.getElementById("single-quiz").classList.add("hidden");
  document.getElementById("quiz-result").classList.add("hidden");
  document.getElementById("quiz-review").classList.add("hidden");
  document.getElementById("Profile").classList.add("hidden");
  // Show login form or redirect as needed
}

function submitQuiz() {
  stopTimer(); // Stop the timer when quiz is submitted

  const currentUserEmail = getCurrentUser();
  if (!currentUserEmail) {
    alert("Please login before submitting a quiz.");
    return;
  }

  let score = 0;
  let wrongAnswers = [];

  const quiz = quizzes.find((q) => q.category === category);

  quiz.questions.forEach((q, index) => {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);

    if (selected) {
      if (selected.value === q.answer) {
        score++;
      } else {
        wrongAnswers.push({
          question: q.question,
          selected: selected.value,
          correct: q.answer,
        });
      }
    } else {
      wrongAnswers.push({
        question: q.question,
        selected: "No answer selected",
        correct: q.answer,
      });
    }
  });

  // Save results
  localStorage.setItem("quizScore", score);
  localStorage.setItem("totalQuestions", quiz.questions.length);
  localStorage.setItem("wrongAnswers", JSON.stringify(wrongAnswers));

  // Save to quiz history
  let quizHistory = JSON.parse(localStorage.getItem("quizHistory")) || [];
  quizHistory.push({
    email: currentUserEmail,
    category: category,
    score: score,
    total: quiz.questions.length,
    date: new Date().toISOString().split("T")[0],
  });
  localStorage.setItem("quizHistory", JSON.stringify(quizHistory));

  // Show results
  showQuizResults();
}

function showQuizResults() {
  const score = localStorage.getItem("quizScore");
  const total = localStorage.getItem("totalQuestions");

  document.getElementById(
    "result-summary"
  ).textContent = `You scored ${score} out of ${total}`;

  document.getElementById("single-quiz").classList.add("hidden");
  document.getElementById("quiz-result").classList.remove("hidden");
}

function reviewAnswers() {
  const wrongAnswers = JSON.parse(localStorage.getItem("wrongAnswers")) || [];
  const reviewBox = document.getElementById("wrong-answers");
  reviewBox.innerHTML = "";

  if (wrongAnswers.length > 0) {
    wrongAnswers.forEach((item) => {
      const div = document.createElement("div");
      div.classList.add(
        "border",
        "p-4",
        "rounded-lg",
        "bg-red-50",
        "shadow-sm"
      );
      div.innerHTML = `
        <p class="font-semibold text-red-700">${item.question}</p>
        <p class="text-gray-700">Your answer: <span class="font-medium">${item.selected}</span></p>
        <p class="text-green-700">Correct answer: <span class="font-medium">${item.correct}</span></p>
      `;
      reviewBox.appendChild(div);
    });
  } else {
    reviewBox.innerHTML = `<p class="text-center text-gray-600">Great job! No wrong answers 🎉</p>`;
  }

  document.getElementById("quiz-result").classList.add("hidden");
  document.getElementById("quiz-review").classList.remove("hidden");
}

// Add event listener for submit button
document.getElementById("submit-quiz")?.addEventListener("click", submitQuiz);

function startTimer() {
  // Clear any existing timer
  clearInterval(quizTimer);

  // Reset time to 10 minutes
  timeLeft = 600;
  updateTimerDisplay();

  // Start the countdown
  quizTimer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    // Change color when time is running low
    const timerElement = document.getElementById("timer");
    if (timeLeft <= 60) {
      // 1 minute left
      timerElement.classList.add("text-red-600");
      timerElement.classList.remove("text-yellow-600");
    } else if (timeLeft <= 180) {
      // 3 minutes left
      timerElement.classList.add("text-yellow-600");
      timerElement.classList.remove("text-red-600");
    }

    // Update progress bar
    const progressPercentage = (timeLeft / 600) * 100;
    // document.getElementById(
    //   "progress-bar"
    // ).style.width = `${progressPercentage}%`;

    // End quiz when time runs out
    if (timeLeft <= 0) {
      clearInterval(quizTimer);
      submitQuiz(); // Auto-submit when time runs out
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById("timer").textContent = `Time Left: ${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
}

function stopTimer() {
  clearInterval(quizTimer);
}
function updateTimer() {
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  hoursDisplay.textContent = hours.toString().padStart(2, "0");
  minutesDisplay.textContent = minutes.toString().padStart(2, "0");
  secondsDisplay.textContent = seconds.toString().padStart(2, "0");

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    alert("Time is up!");
    // Handle time expiration
  }

  timeLeft--;
}

const timerInterval = setInterval(updateTimer, 1000);
updateTimer(); // Initial call to display the time immediately
