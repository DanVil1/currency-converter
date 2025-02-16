import React, { useState, useEffect } from 'react';

function CurrencyConverter() {
  const [amount, setAmount] = useState('');
  const [sourceCurrency, setSourceCurrency] = useState('EUR');
  const [destCurrency, setDestCurrency] = useState('USD');
  const [convertedValue, setConvertedValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Reset conversion output if no amount is provided.
    if (amount === '') {
      setConvertedValue('');
      return;
    }
    // Validate that the input is a valid number.
    if (isNaN(amount)) {
      setError('Please enter a valid number');
      setConvertedValue('');
      return;
    } else {
      setError('');
    }

    // Build the URL for the Frankfurter API.
    const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${sourceCurrency}&to=${destCurrency}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // The API returns converted amount inside data.rates with the destination currency key.
        if (data && data.rates && data.rates[destCurrency] !== undefined) {
          setConvertedValue(parseFloat(data.rates[destCurrency]).toFixed(2));
        } else {
          setError('Conversion rate not found');
          setConvertedValue('');
        }
      })
      .catch(err => {
        console.error('Error fetching conversion rate:', err);
        setError('Error fetching conversion rate');
        setConvertedValue('');
      });
  }, [amount, sourceCurrency, destCurrency]);

  // Handler for swapping currencies.
  const handleSwap = () => {
    setSourceCurrency(destCurrency);
    setDestCurrency(sourceCurrency);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Currency Converter</h1>
      <div>
        <input
          type="text"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => {
            // Allow up to 9 characters
            if (e.target.value.length <= 9) {
              setAmount(e.target.value);
            }
          }}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>
          From:
          <select
            value={sourceCurrency}
            onChange={(e) => setSourceCurrency(e.target.value)}
            style={{ marginLeft: '5px' }}
          >
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
          </select>
        </label>
        <button onClick={handleSwap} style={{ margin: '0 10px' }}>
          Swap
        </button>
        <label>
          To:
          <select
            value={destCurrency}
            onChange={(e) => setDestCurrency(e.target.value)}
            style={{ marginLeft: '5px' }}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </label>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h2>Converted Value: {convertedValue}</h2>
      </div>
    </div>
  );
}

export default CurrencyConverter;
