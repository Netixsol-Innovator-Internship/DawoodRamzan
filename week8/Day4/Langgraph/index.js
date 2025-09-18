import * as dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import readline from "readline";
import { writeFileSync } from "fs";
import { execSync } from "child_process";

// 1. Initialize Gemini model
const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.0-flash", // free tier
});

// 2. Define node functions
const callModel = async (state) => {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
};

const calculatorTool = async (state) => {
  const lastMsg = state.messages[state.messages.length - 1]?.content || "";
  let result;
  try {
    if (/^[0-9+\-*/().\s]+$/.test(lastMsg)) {
      result = eval(lastMsg); // ⚠️ demo only
    } else {
      result = "Sorry, I can only calculate pure math expressions like 2+2.";
    }
  } catch (err) {
    result = "Error in calculation.";
  }

  return {
    messages: [
      {
        role: "assistant",
        content: `The result is: ${result}  -----------`,
      },
    ],
  };
};

// 3. Create graph
const graph = new StateGraph(MessagesAnnotation)
  .addNode("chatbot", callModel)
  .addNode("calculator", calculatorTool)
  .addConditionalEdges(
    "__start__",
    (state) => {
      const lastMsg = state.messages[state.messages.length - 1]?.content || "";
      if (/^[0-9+\-*/().\s]+$/.test(lastMsg)) {
        return "calculator";
      }
      return "chatbot";
    },
    {
      calculator: "calculator",
      chatbot: "chatbot",
    }
  );

const app = graph.compile();
console.log(Object.getOwnPropertyNames(app.getGraph()));

// 5. Setup CLI
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("🤖 Gemini LangGraph Chatbot started! Type 'exit' to quit.");

// --------------------------------

async function exportGraph() {
  const graphObj = app.getGraph();

  // Convert nodes and edges into arrays
  const nodes = Array.from(graphObj.nodes.values?.() ?? graphObj.nodes);
  const edges = Array.from(graphObj.edges.values?.() ?? graphObj.edges);

  // Build DOT manually
  let dot = "digraph LangGraph {\n";
  for (const node of nodes) {
    const nodeId = node.id || node; // sometimes it's just a string
    dot += `  "${nodeId}" [shape=box];\n`;
  }
  for (const edge of edges) {
    const src = edge.source || edge[0];
    const tgt = edge.target || edge[1];
    dot += `  "${src}" -> "${tgt}";\n`;
  }
  dot += "}\n";

  writeFileSync("graph.dot", dot);

  // Convert DOT → PNG & PDF
  execSync("dot -Tpng graph.dot -o graph.png");
  execSync("dot -Tpdf graph.dot -o graph.pdf");

  console.log(
    "📊 Graph visualization saved as graph.png, graph.pdf, and graph.dot"
  );
}

async function ask(state = { messages: [] }) {
  rl.question("You: ", async (input) => {
    if (input.toLowerCase() === "exit") {
      rl.close();
      await exportGraph();

      return;
    }

    const newState = await app.invoke({
      messages: [...state.messages, { role: "user", content: input }],
    });

    const lastMessage = newState.messages[newState.messages.length - 1];
    console.log("AI:", lastMessage.content);

    ask(newState);
  });
}
ask();
