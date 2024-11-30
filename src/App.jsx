import React, { useState, useRef } from "react";
import "./App.css";

const App = () => {
  const [texts, setTexts] = useState([]);
  const [currentText, setCurrentText] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [fontStyle, setFontStyle] = useState("normal");
  const [color, setColor] = useState("#000000");
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const canvasRef = useRef();

  const addText = () => {
    if (!currentText) return;
    const newText = {
      id: Date.now(),
      content: currentText,
      x: 50,
      y: 50,
      fontSize,
      fontStyle,
      color,
    };
    const updatedTexts = [...texts, newText];
    setTexts(updatedTexts);
    saveToHistory(updatedTexts);
    setCurrentText("");
  };

  const saveToHistory = (newTexts) => {
    setHistory((prev) => [...prev, texts]);
    setRedoStack([]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const prevState = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setRedoStack((prev) => [texts, ...prev]);
    setTexts(prevState);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[0];
    setRedoStack((prev) => prev.slice(1));
    setHistory((prev) => [...prev, texts]);
    setTexts(nextState);
  };

  const handleDrag = (id, e) => {
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const updatedTexts = texts.map((text) => {
      if (text.id === id) {
        return {
          ...text,
          x: e.clientX - canvasRect.left,
          y: e.clientY - canvasRect.top,
        };
      }
      return text;
    });
    setTexts(updatedTexts);
  };

  const removeText = (id) => {
    const updatedTexts = texts.filter((text) => text.id !== id);
    setTexts(updatedTexts);
    saveToHistory(updatedTexts);
  };

  return (
    <div className="App">
      <div className="controls">
        <input
          type="text"
          placeholder="Enter text"
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
        />
        <input
          type="number"
          placeholder="Font size"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
        />
        <select
          value={fontStyle}
          onChange={(e) => setFontStyle(e.target.value)}
        >
          <option value="normal">Normal</option>
          <option value="italic">Italic</option>
          <option value="bold">Bold</option>
        </select>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <button onClick={addText} className="btn">
          Add Text
        </button>
        <button onClick={undo} className="btn undo">
          Undo
        </button>
        <button onClick={redo} className="btn redo">
          Redo
        </button>
      </div>

      <div className="canvas" ref={canvasRef}>
        {texts.map((text) => (
          <div
            key={text.id}
            className="text"
            style={{
              top: text.y,
              left: text.x,
              fontSize: text.fontSize,
              fontStyle: text.fontStyle,
              color: text.color,
            }}
            draggable
            onDrag={(e) => handleDrag(text.id, e)}
          >
            {text.content}
            <button
              className="remove-btn"
              onClick={() => removeText(text.id)}
            >
              ✖
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
