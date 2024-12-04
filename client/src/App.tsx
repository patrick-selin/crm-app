import "./App.css";
import TestComponent from "./utils/test-component";
import testService from "./services/test-service";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router";

interface TestItem {
  id: number;
  content: string;
  important: boolean;
}
function App() {
  const [testData, setTestData] = useState<TestItem[]>([]);

  useEffect(() => {
    testService.getAll().then((testItems) => {
      console.log("Fetched data:", testItems);
      setTestData(testItems);
    });
  }, []);

  return (
    <>
      <h1>Vite + React with TS</h1>
      <TestComponent />
      <div>
        <h2>TestData</h2>
        <ul>
          {testData.map((item) => (
            <li key={item.id}>
              <h3>{item.content}</h3>
              <p>{item.important ? "Important" : "Not Important"}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
