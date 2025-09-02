import React, { useState, useEffect } from "react";

export default function PomodoroModal({ subject, onClose }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutos
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const resetTimer = () => {
    setTimeLeft(25 * 60);
    setIsRunning(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          Estudando: <span className="text-violet-600">{subject}</span>
        </h2>

        <div className="text-5xl font-mono text-center mb-6">
          {formatTime(timeLeft)}
        </div>

        <div className="flex justify-center gap-4">
          <button
            className={`px-6 py-3 rounded-xl text-white font-semibold transition ${
              isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
            }`}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? "Pausar" : "Iniciar"}
          </button>

          <button
            className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 font-semibold transition"
            onClick={resetTimer}
          >
            Resetar
          </button>
        </div>

        <button
          className="mt-6 w-full bg-violet-600 text-white py-3 rounded-xl hover:bg-violet-700 transition"
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
