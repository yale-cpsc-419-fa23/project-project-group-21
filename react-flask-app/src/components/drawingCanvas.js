import "../styles/kanji.css";

import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography } from "@mui/material";

const DrawingCanvas = ({setAnswer, clear, clear_func}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if(clear === true) {
      handleClearCanvas();
      clear_func(false);
    }
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const startDrawing = (event) => {
      const { left, top } = canvas.getBoundingClientRect();
      const x = event.clientX - left;
      const y = event.clientY - top;

      context.beginPath();
      context.moveTo(x, y);
      setIsDrawing(true);
    };

    const draw = (event) => {
      if (!isDrawing) return;

      const { left, top } = canvas.getBoundingClientRect();
      const x = event.clientX - left;
      const y = event.clientY - top;

      context.strokeStyle = 'black'; // Set line color
      context.lineWidth = 3; // Set line width
      context.lineCap = 'round'; // Set line cap style

      context.lineTo(x, y);
      context.stroke();
    };

    const stopDrawing = () => {
      setIsDrawing(false);
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
    };
  }, [isDrawing, clear]);

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleRecognizeHandwriting = async () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    // console.log('DataURL:', dataURL);

    try {
      const response = await fetch('/retrieve-kanji', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: dataURL }),
      });

      // Handle the response from your server
      const result = await response.json();
      console.log('Handwriting recognition result:', result);
      setAnswer(result[0]);
      handleClearCanvas();
    } catch (error) {
      console.error('Error sending image to backend:', error);
    }
  };

  return (
    <Box className="canvas-container">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="drawing-canvas"
      />
      <Box className="button-container">
        <button onClick={handleClearCanvas}>Clear Canvas</button>
        <button onClick={handleRecognizeHandwriting}>Recognize Handwriting</button>
      </Box>
    </Box>
  );
};

export default DrawingCanvas;