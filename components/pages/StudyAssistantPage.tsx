import React, { useState } from "react";
import {
  Card,
  CardContent,
} from "../ui/Card";

type Flashcard = {
  term: React.ReactNode;
  definition: string;
};

type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

type StudyMaterial = {
  summary: string;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
};

const studyData: Record<string, StudyMaterial> = {
  react: {
    summary: `React is a popular open-source JavaScript library developed by Facebook for building user interfaces, especially single-page applications (SPAs). It enables developers to create reusable, modular UI components that efficiently manage and update the view layer. React uses a virtual DOM to optimize rendering performance by updating only the parts of the DOM that have changed, rather than reloading the entire page. It follows a unidirectional data flow, which makes debugging and state management more predictable and easier to maintain. React’s ecosystem includes tools like React Router for navigation, React Hooks for state and side-effect management, and Redux or Context API for centralized state management. JSX, a syntax extension of JavaScript used in React, allows HTML-like code within JavaScript, improving readability and development efficiency. React is widely used in modern web development for creating dynamic, responsive, and high-performance applications, and it has a strong community that continuously contributes to its growth and innovation.`,
    flashcards: [
      { term: <>React</>, definition: "JavaScript library for building UI." },
      { term: <>Virtual DOM</>, definition: "Optimizes rendering by updating only changed parts." },
      { term: <>JSX</>, definition: "JavaScript XML syntax for writing HTML-like structures." },
    ],
    quiz: [
      {
        question: "Which company developed React?",
        options: ["Google", "Facebook", "Microsoft"],
        correctIndex: 1,
      },
      {
        question: "What feature allows React to update UI efficiently?",
        options: ["Virtual DOM", "Shadow DOM", "Real DOM"],
        correctIndex: 0,
      },
      {
        question: "Which hook is used for state management?",
        options: ["useEffect", "useState", "useRef"],
        correctIndex: 1,
      },
    ],
  },
  nodejs: {
    summary: `Node.js is a powerful, open-source, cross-platform JavaScript runtime built on Chrome’s V8 engine that allows developers to execute JavaScript on the server side. Unlike traditional server-side technologies, Node.js uses an event-driven, non-blocking I/O model, making it lightweight, efficient, and ideal for scalable applications that handle many simultaneous connections. It comes with a built-in package manager called npm, which provides access to thousands of libraries for rapid development. Node.js is commonly used to build web servers, RESTful APIs, real-time applications like chat apps, streaming services, and microservices architectures. Its asynchronous nature ensures high performance and responsiveness, while frameworks like Express.js simplify routing, middleware, and server management. Node.js enables developers to use JavaScript across the entire stack, promoting faster development, code reusability, and seamless integration between front-end and back-end systems. Its ecosystem and community support make it one of the most popular server-side platforms today.`,
    flashcards: [
      { term: <>Node.js</>, definition: "JavaScript runtime environment." },
      { term: <>Event Loop</>, definition: "Handles async I/O calls." },
      { term: <>npm</>, definition: "Package manager for the Node.js ecosystem." },
    ],
    quiz: [
      {
        question: "Node.js is powered by which JavaScript engine?",
        options: ["SpiderMonkey", "V8", "Chakra"],
        correctIndex: 1,
      },
      {
        question: "What kind of I/O model does Node.js use?",
        options: ["Blocking", "Non-blocking", "Synchronous"],
        correctIndex: 1,
      },
      {
        question: "Is Node.js single-threaded?",
        options: ["Yes", "No", "Sometimes"],
        correctIndex: 0,
      },
    ],
  },
  html: {
    summary: `HTML (HyperText Markup Language) is the foundational language used to create and structure content on the World Wide Web. It defines the elements that make up a web page and organizes them into a hierarchical document structure. HTML consists of tags enclosed in angle brackets, such as <h1> for headings, <p> for paragraphs, <a> for hyperlinks, and <img> for images. These tags can have attributes, like id, class, src, and alt, which provide additional information or functionality to elements.

A typical HTML document is divided into two main sections: the <head> and the <body>. The <head> contains metadata, links to stylesheets, scripts, and other resources that help control the page’s behavior and appearance, while the <body> contains the content visible to users. HTML supports a variety of content types, including text, images, videos, forms, tables, and lists, allowing developers to structure information logically and semantically.

HTML works in conjunction with CSS (Cascading Style Sheets) for styling and JavaScript for dynamic behavior, creating interactive and visually appealing websites. Semantic HTML tags, such as <header>, <footer>, <article>, and <section>, improve accessibility and SEO by providing meaningful context to browsers and search engines. Overall, HTML is a simple yet powerful language that forms the backbone of web development, enabling developers to present information effectively and consistently across browsers and devices.`,
    flashcards: [
      { term: <>HTML</>, definition: "Markup language for the web." },
      { term: <>Tags</>, definition: "Elements that define web content." },
      { term: <>Semantic Tags</>, definition: "Tags conveying meaning like <header>, <footer>." },
    ],
    quiz: [
      {
        question: "What does HTML stand for?",
        options: ["HyperText Markup Language", "Home Tool Markup Language", "Hyperlinks Text Markup Language"],
        correctIndex: 0,
      },
      {
        question: "Which tag defines a hyperlink?",
        options: ["<a>", "<link>", "<href>"],
        correctIndex: 0,
      },
      {
        question: "HTML5 introduced which of the following?",
        options: ["Frames", "Semantic elements", "Tables"],
        correctIndex: 1,
      },
    ],
  },
  css: {
    summary: `CSS (Cascading Style Sheets) is used to style and visually format HTML content on web pages. It controls colors, fonts, spacing, borders, backgrounds, and layouts, making websites attractive and user-friendly. CSS uses selectors to target elements and applies properties like color, font-size, margin, padding, display, flex, and grid. It supports responsive design through media queries, ensuring pages adapt to different screen sizes. Advanced features include transitions, animations, and pseudo-classes for dynamic effects. CSS works alongside HTML to separate structure from presentation, creating maintainable, scalable, and visually appealing web designs efficiently.`,
    flashcards: [
      { term: <>CSS</>, definition: "Style sheets for web content." },
      { term: <>Box Model</>, definition: "Margin, border, padding & content of elements." },
      { term: <>Media Queries</>, definition: "Enables responsive designs." },
    ],
    quiz: [
      {
        question: "What does CSS stand for?",
        options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System"],
        correctIndex: 1,
      },
      {
        question: "Which property controls text color?",
        options: ["color", "font-weight", "padding"],
        correctIndex: 0,
      },
      {
        question: "Which CSS feature helps responsive design?",
        options: ["Media Queries", "Flexbox", "Grid"],
        correctIndex: 0,
      },
    ],
  },
};

type Tab = "summary" | "flashcards" | "quiz";

const FlashcardComponent: React.FC<{ card: Flashcard }> = ({ card }) => {
  const [flipped, setFlipped] = React.useState(false);
  return (
    <div className="w-full h-48 cursor-pointer perspective-1000" onClick={() => setFlipped(f => !f)}>
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${flipped ? "rotate-y-180" : ""}`} >
        <div className="absolute w-full h-full backface-hidden bg-blue-600 text-white rounded-lg flex items-center justify-center p-4 text-center">
          <h3 className="text-xl font-bold text-black">{card.term}</h3>
        </div>
        <div className="absolute w-full h-full backface-hidden bg-white text-black rounded-lg flex items-center justify-center p-4 text-center rotate-y-180">
          <p className="text-lg">{card.definition}</p>
        </div>
      </div>
    </div>
  );
};

const QuizComponent: React.FC<{ quiz: QuizQuestion[] }> = ({ quiz }) => {
  const [answers, setAnswers] = React.useState<(number | null)[]>(quiz.map(() => null));
  const [submitted, setSubmitted] = React.useState(false);

  const selectAnswer = (qIndex: number, optionIdx: number) => {
    if (submitted) return;
    setAnswers(prev => {
      const copy = [...prev];
      copy[qIndex] = optionIdx;
      return copy;
    });
  };

  const score = React.useMemo(() => {
    if (!submitted) return null;
    return answers.reduce((total, ans, idx) => total + (ans === quiz[idx].correctIndex ? 1 : 0), 0);
  }, [answers, quiz, submitted]);

  const submitQuiz = () => {
    if (answers.includes(null)) {
      alert("Please answer all questions before submitting.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div>
      {quiz.map((q, idx) => {
        const selected = answers[idx];
        return (
          <div key={idx} className="mb-6 p-4 border rounded">
            <p className="mb-3 font-semibold text-lg text-white">{idx+1}. {q.question}</p>
            <div className="flex flex-col gap-2">
              {q.options.map((opt, oidx) => {
                const correct = q.correctIndex === oidx;
                const isSelected = selected === oidx;
                const showCorrect = submitted && correct;
                const showWrong = submitted && isSelected && !correct;
                return (
                  <button
                    key={oidx}
                    onClick={() => selectAnswer(idx, oidx)}
                    disabled={submitted}
                    className={`w-full text-left px-4 py-2 rounded transition text-black 
                      ${isSelected ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"} 
                      ${showCorrect ? " text-green-500" : ""}
                      ${showWrong ? "bg-red-500 text-white" : ""}
                    `}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        );
      })}
      {!submitted ? (
        <button 
          className="w-full py-3 mt-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700"
          onClick={submitQuiz}
          disabled={answers.includes(null)}
        >
          Submit Quiz
        </button>
      ) : (
        <div className="mt-4 p-4 max-w-xs mx-auto text-center bg-green-100 font-bold text-green-700 rounded">
          Your score: {score} / {quiz.length}
        </div>
      )}
    </div>
  );
};

const StudyAssistantPage: React.FC = () => {
  const [query, setQuery] = React.useState("");
  const [selectedTopic, setSelectedTopic] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<Tab>("summary");
  const [error, setError] = React.useState<string | null>(null);

  const handleGenerate = () => {
    const key = query.trim().toLowerCase();
    if (!key || !(key in studyData)) {
      setSelectedTopic(null);
      setError("Please enter a valid topic: React, Nodejs, HTML, or CSS.");
      return;
    }
    setError(null);
    setSelectedTopic(key);
    setActiveTab("summary");
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Enter a topic like React, Nodejs, HTML, CSS"
          className="w-full p-3 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-black "
          aria-label="Input topic"
        />
        <button
          onClick={handleGenerate}
          className="mt-3 w-full rounded bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Generate
        </button>
        {error && <p className="mt-2 text-red-600">{error}</p>}
      </div>
      {selectedTopic && (
        <>
          <nav className="mb-6 flex space-x-8 font-semibold text-lg border-b border-gray-300">
            <button
              className={`pb-2 ${activeTab === "summary" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-700 hover:text-gray-900"}`}
              onClick={() => setActiveTab("summary")}
            >
              Summary
            </button>
            <button
              className={`pb-2 ${activeTab === "flashcards" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-700 hover:text-gray-900"}`}
              onClick={() => setActiveTab("flashcards")}
            >
              Flashcards
            </button>
            <button
              className={`pb-2 ${activeTab === "quiz" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-700 hover:text-gray-900"}`}
              onClick={() => setActiveTab("quiz")}
            >
              Quiz
            </button>
          </nav>
          {activeTab === "summary" && (
            <section className="bg-white p-6 rounded prose text-black whitespace-pre-wrap shadow-md">
              {studyData[selectedTopic].summary}
            </section>
          )}
          {activeTab === "flashcards" && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studyData[selectedTopic].flashcards.map((card, idx) => (
                <Card key={idx}>
                  <CardContent>
                    <h3 className="font-bold text-xl text-black mb-2 text-white">{card.term}</h3>
                    <p className="text-black text-white">{card.definition}</p>
                  </CardContent>
                </Card>
              ))}
            </section>
          )}
          {activeTab === "quiz" && (
            <QuizComponent quiz={studyData[selectedTopic].quiz} />
          )}
        </>
      )}
    </div>
  );
};

export default StudyAssistantPage;
