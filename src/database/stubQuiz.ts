import Quiz from "../Objects/Quiz";

const quizData: Quiz[] = [
  {
    id: 1,
    name: "Capitals of Europe",
    genre: "Geography",
    questions: [
      {
        id: 1,
        question: "What is the capital of France?",
        answers: ["Paris", "London", "Berlin", "Madrid"],
        correctAnswer: "Paris",
      },
      {
        id: 2,
        question: "What is the capital of Germany?",
        answers: ["Paris", "London", "Berlin", "Madrid"],
        correctAnswer: "Berlin",
      },
      {
        id: 3,
        question: "What is the capital of Spain?",
        answers: ["Paris", "London", "Berlin", "Madrid"],
        correctAnswer: "Madrid",
      },
    ],
    image:
      "https://cdn.britannica.com/67/367-050-CCA16287/Europe-political-boundaries-continent.jpg",
    creator: {
      id: 1,
      username: "Fubuki",
      email: "Fubuki@gmail.com",
      ranking: 1,
      image: "/guest.png",
    },
  },
  {
    id: 2,
    name: "Capitals of Asia",
    genre: "Geography",
    questions: [
      {
        id: 1,
        question: "What is the capital of Japan?",
        answers: ["Tokyo", "Beijing", "Seoul", "Bangkok"],
        correctAnswer: "Tokyo",
      },
      {
        id: 2,
        question: "What is the capital of China?",
        answers: ["Tokyo", "Beijing", "Seoul", "Bangkok"],
        correctAnswer: "Beijing",
      },
      {
        id: 3,
        question: "What is the capital of South Korea?",
        answers: ["Tokyo", "Beijing", "Seoul", "Bangkok"],
        correctAnswer: "Seoul",
      },
    ],
    image:
      "https://cdn.britannica.com/20/5920-050-5A543266/Asia-political-boundaries-continent.jpg",
    creator: {
      id: 1,
      username: "Fubuki",
      email: "Fubuki@gmail.com",
      ranking: 1,
      image: "/guest.png",
    },
  },
  {
    id: 3,
    name: "Capitals of Africa",
    genre: "Geography",
    questions: [
      {
        id: 1,
        question: "What is the capital of Nigeria?",
        answers: ["Lagos", "Cairo", "Nairobi", "Abuja"],
        correctAnswer: "Abuja",
      },
      {
        id: 2,
        question: "What is the capital of Egypt?",
        answers: ["Lagos", "Cairo", "Nairobi", "Abuja"],
        correctAnswer: "Cairo",
      },
      {
        id: 3,
        question: "What is the capital of Kenya?",
        answers: ["Lagos", "Cairo", "Nairobi", "Abuja"],
        correctAnswer: "Nairobi",
      },
    ],
    image:
      "https://cdn.britannica.com/63/5363-050-90082F00/Africa-political-boundaries-continent.jpg",
    creator: {
      id: 1,
      username: "Fubuki",
      email: "Fubuki@gmail.com",
      ranking: 1,
      image: "/guest.png",
    },
  },
  {
    id: 4,
    name: "Capitals of North America",
    genre: "Geography",
    questions: [
      {
        id: 1,
        question: "What is the capital of Canada?",
        answers: ["Toronto", "Ottawa", "Vancouver", "Montreal"],
        correctAnswer: "Ottawa",
      },
      {
        id: 2,
        question: "What is the capital of Mexico?",
        answers: ["Toronto", "Ottawa", "Vancouver", "Mexico City"],
        correctAnswer: "Mexico City",
      },
      {
        id: 3,
        question: "What is the capital of the United States?",
        answers: ["Toronto", "Ottawa", "Washington D.C.", "Montreal"],
        correctAnswer: "Washington D.C.",
      },
    ],
    image:
      "https://c.files.bbci.co.uk/4616/live/d710a6a0-d4b0-11ef-9fd6-0be88a764111.jpg",
    creator: {
      id: 1,
      username: "Trump wishes",
      email: "Trump@gmail.com",
      ranking: 1,
      image: "/guest.png",
    },
  },
  {
    id: 5,
    name: "Capitals of South America",
    genre: "Geography",
    questions: [
      {
        id: 1,
        question: "What is the capital of Brazil?",
        answers: ["Buenos Aires", "Santiago", "Lima", "Brasília"],
        correctAnswer: "Brasília",
      },
      {
        id: 2,
        question: "What is the capital of Argentina?",
        answers: ["Buenos Aires", "Santiago", "Lima", "Brasília"],
        correctAnswer: "Buenos Aires",
      },
      {
        id: 3,
        question: "What is the capital of Chile?",
        answers: ["Buenos Aires", "Santiago", "Lima", "Brasília"],
        correctAnswer: "Santiago",
      },
    ],
    image:
      "https://cdn.britannica.com/86/3886-050-2785B482/South-America-political-continent.jpg",
    creator: {
      id: 1,
      username: "Fubuki",
      email: "Fubuki@gmail.com",
      ranking: 1,
      image: "/guest.png",
    },
  },
  {
    id: 6,
    name: "Why am I so broke",
    genre: "Depression",
    questions: [],
    image:
      "https://miro.medium.com/v2/resize:fit:1400/1*7HTzbeMGCDnDvdV-IrSYZA.jpeg",
    creator: {
      id: 1,
      username: "Fubuki",
      email: "Fubuki@gmail.com",
      ranking: 1,
      image: "/guest.png",
    },
  },
  {
    id: 7,
    name: "Best Among us race",
    genre: "Philosophy",
    questions: [],
    image:
      "https://media.wired.com/photos/620581d7c228dc232641feaa/16:9/w_2400,h_1350,c_limit/Games-Innersloth-Among-Us-Key-Art.jpg",
    creator: {
      id: 1,
      username: "Fubuki",
      email: "no body",
      ranking: 1,
      image: "/guest.png",
    },
  },
  {
    id: 8,
    name: "The size of your Mom",
    genre: "Science",
    questions: [],
    image:
      "https://s.abcnews.com/images/Technology/whale-gty-jt-191219_hpMain.jpg",
    creator: {
      id: 1,
      username: "Fubuki",
      email: "no body",
      ranking: 1,
      image: "/guest.png",
    },
  },
  {
    id: 9,
    name: "The best pizza in Austin",
    genre: "Austin Pizza",
    questions: [],
    image:
      "https://www.foodandwine.com/thmb/Wd4lBRZz3X_8qBr69UOu2m7I2iw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/classic-cheese-pizza-FT-RECIPE0422-31a2c938fc2546c9a07b7011658cfd05.jpg",
    creator: {
      id: 1,
      username: "Austin",
      email: "no body",
      ranking: 1,
      image: "/guest.png",
    },
  },
  {
    id: 10,
    name: "Why does your nose run but your feet smell?",
    genre: "English",
    questions: [],
    image:
      "https://api.hub.jhu.edu/factory/sites/default/files/styles/landscape/public/depression-hub.jpg",
    creator: {
      id: 1,
      username: "Austin's mom",
      email: "no body",
      ranking: 1,
      image: "/guest.png",
    },
  },
  {
    id: 11,
    name: "Is cereal soup?",
    genre: "English",
    questions: [],
    image:
      "https://media.gq-magazine.co.uk/photos/5d1390269a22c2b6ef9478f3/16:9/w_2560%2Cc_limit/depression-gq-7aug18_istock_b.jpg",
    creator: {
      id: 1,
      username: "Austin's mom",
      email: "no body",
      ranking: 1,
      image: "/guest.png",
    },
  },
  {
    id: 12,
    name: "Does a straw have one hole or two?",
    genre: "English",
    questions: [],
    image:
      "https://www.logansportmemorial.org/wp-content/uploads/Depression.jpeg",
    creator: {
      id: 1,
      username: "Austin's mom",
      email: "no body",
      ranking: 1,
      image: "/guest.png",
    },
  },
];

export default quizData;
