import React, { useState, useEffect } from 'react';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('');
  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [destCurrency, setDestCurrency] = useState('EUR');
  const [result, setResult] = useState(null);
  
  const currencies = ['AUD', 'BRL', 'CAD', 'CHF', 'CNY', 'EUR', 'GBP', 'INR', 'JPY', 'USD'];
  
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value !== '' && isNaN(value)) {
      alert('Please enter a valid number');
      return;
    }
    if (value.length > 9) return;
    setAmount(value);
  };

  const handleSwap = () => {
    setSourceCurrency(destCurrency);
    setDestCurrency(sourceCurrency);
  };

  useEffect(() => {
    if (amount === '' || isNaN(amount)) return;
    
    const fetchConversion = async () => {
      try {
        const query = `${sourceCurrency}_${destCurrency}`;
        const response = await fetch(`https://free.currencyconverterapi.com/api/v6/convert?q=${query}&compact=ultra`);
        const data = await response.json();
        const rate = data[query];
        if (rate) {
          setResult((amount * rate).toFixed(2));
        } else {
          setResult('N/A');
        }
      } catch (error) {
        console.error('Error fetching conversion rate:', error);
      }
    };

    fetchConversion();
  }, [amount, sourceCurrency, destCurrency]);

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Currency Converter</h1>
      <div>
        <input 
          type="text" 
          value={amount} 
          onChange={handleAmountChange} 
          placeholder="Enter amount" 
          style={{ width: '100%', padding: '8px', fontSize: '16px' }}
        />
      </div>
      <div style={{ margin: '10px 0' }}>
        <select 
          value={sourceCurrency} 
          onChange={(e) => setSourceCurrency(e.target.value)}
          style={{ width: '45%', padding: '8px', fontSize: '16px' }}
        >
          {currencies.sort().map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>

        <button onClick={handleSwap} style={{ margin: '0 10px', padding: '8px 12px', fontSize: '16px' }}>
          Swap
        </button>

        <select 
          value={destCurrency} 
          onChange={(e) => setDestCurrency(e.target.value)}
          style={{ width: '45%', padding: '8px', fontSize: '16px' }}
        >
          {currencies.sort().map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: '20px', fontSize: '18px' }}>
        <strong>Converted Amount: </strong> {result !== null ? result : '0.00'}
      </div>
    </div>
  );
};

export default CurrencyConverter;
