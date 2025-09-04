
import React, { useState } from 'react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');

  const handleButtonClick = (value: string) => {
    if (value === 'C') {
      setDisplay('0');
      setExpression('');
    } else if (value === '=') {
      try {
        // Caution: eval is used for simplicity in this simulation.
        // It should not be used in production applications with untrusted input.
        const result = eval(expression.replace(/x/g, '*').replace(/÷/g, '/'));
        setDisplay(String(result));
        setExpression(String(result));
      } catch (error) {
        setDisplay('Error');
        setExpression('');
      }
    } else {
        if (display === '0' || display === 'Error') {
            setDisplay(value);
            setExpression(value);
        } else {
            setDisplay(display + value);
            setExpression(expression + value);
        }
    }
  };

  const buttons = [
    'C', '÷', 'x', '7', '8', '9', '-', '4', '5', '6', '+', '1', '2', '3', '=', '0', '.'
  ];
  
  return (
    <div className="h-full flex flex-col bg-gray-900 rounded-b-lg p-2">
      <div className="bg-gray-800 text-white text-3xl text-right p-4 rounded-t-lg mb-2">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2 flex-grow">
        {buttons.map((btn) => {
            const isOperator = ['÷', 'x', '-', '+', '='].includes(btn);
            const isClear = btn === 'C';
            const isZero = btn === '0';

            return (
              <button
                key={btn}
                onClick={() => handleButtonClick(btn)}
                className={`text-xl p-2 rounded-md transition-colors
                  ${isOperator ? 'bg-cyan-600 hover:bg-cyan-700' : ''}
                  ${isClear ? 'bg-red-600 hover:bg-red-700 col-span-2' : ''}
                  ${isZero ? 'col-span-2' : ''}
                  ${!isOperator && !isClear ? 'bg-gray-700 hover:bg-gray-600' : ''}
                `}
              >
                {btn}
              </button>
            )
        })}
      </div>
    </div>
  );
};

export default Calculator;
