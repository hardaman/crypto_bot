import fetch from 'node-fetch';

const args = process.argv.slice(2);
const symbol = args[0] || 'BTC';
const endpoint = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${symbol}&tsym=USD&limit=2000`;

let allCandles = [];
let totalCandles = 0;
fetch(endpoint)
  .then(response => response.json())
  .then(data => {
    if (data.Response === 'Error') {
      throw new Error(data.Message);
    }
    const candles = data.Data.Data;
    allCandles = allCandles.concat(candles);
    totalCandles += candles.length;
    if (totalCandles < 8760) {
      return fetch(`${endpoint}&toTs=${candles[0].time - 1}`);
    }
    return null;
  })
  .then(response => {
    if (response) {
      return response.json();
    }
    return null;
  })
  .then(data => {
    if (data && data.Response === 'Error') {
      throw new Error(data.Message);
    }
    if (data) {
      const candles = data.Data.Data;
      allCandles = allCandles.concat(candles);
      totalCandles += candles.length;
    }
    if (totalCandles < 8760) {
      return fetch(`${endpoint}&toTs=${allCandles[0].time - 1}`);
    }
    return null;
  })
  .then(response => {
    if (response) {
      return response.json();
    }
    return null;
  })
  .then(data => {
    if (data && data.Response === 'Error') {
      throw new Error(data.Message);
    }
    if (data) {
      const candles = data.Data.Data;
      allCandles = allCandles.concat(candles);
      totalCandles += candles.length;
    }

    const decreases = allCandles.filter((candle, index) => {
      if (index === 0) {
        return false;
      }
      return candle.close < allCandles[index - 1].close;
    });

    const buckets = [];
    let currentBucket = [];
    for (let i = 0; i < decreases.length; i++) {
      currentBucket.push(decreases[i]);
      if (i === decreases.length - 1 || decreases[i + 1].time - decreases[i].time > 3600) {
        buckets.push(currentBucket);
        currentBucket = [];
      }
    }

    const medianDecreases = buckets.map(bucket => {
      const decreases = bucket.map(candle => (candle.close - candle.open) / candle.open);
      return median(decreases);
    });

    const optimalSellPoint = median(medianDecreases);
    console.log(`The optimal sell point for ${symbol} is ${optimalSellPoint * 100}%`);
  })
  .catch(error => {
    console.error(error);
  });

  function median(numbers) {
    const sorted = numbers.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
  
    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    } else {
      return sorted[middle];
    }
  }