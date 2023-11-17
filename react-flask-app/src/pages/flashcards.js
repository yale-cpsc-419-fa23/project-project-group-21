// Flashcards.js
import React from 'react';

const Flashcards = ({ location }) => {
  const flashcardsData = location.state.flashcards;

  // Assuming flashcardsData is an array of arrays

  return (
    <div>
      <h2>Flashcards</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Column 1</th>
            <th>Column 2</th>
            {/* Add more columns as needed */}
          </tr>
        </thead>
        <tbody>
          {flashcardsData.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Flashcards;
