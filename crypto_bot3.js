import fetch from "node-fetch";

const args = process.argv.slice(2); 
const coin = args[0] || 'BTC';

const trades = [
  { coin: coin, type: 'buy', amount: 10, price: 100, fees: 1 },
  { coin: coin, type: 'sell', amount: 5, price: 120, fees: 1 },
  { coin: coin, type: 'buy', amount: 3, price: 110, fees: 0.5 }
];

const coinTrades = trades.filter(trade => trade.coin === coin);

const totalBought = coinTrades.filter(trade => trade.type === 'buy').reduce((total, trade) => total + trade.amount, 0);
const totalSold = coinTrades.filter(trade => trade.type === 'sell').reduce((total, trade) => total + trade.amount, 0);
const totalFees = coinTrades.reduce((total, trade) => total + trade.fees, 0);

const totalCost = coinTrades.filter(trade => trade.type === 'buy').reduce((total, trade) => total + (trade.amount * trade.price), 0);
const totalRevenue = coinTrades.filter(trade => trade.type === 'sell').reduce((total, trade) => total + (trade.amount * trade.price), 0);

const currentPriceURL = `https://api.pro.coinbase.com/products/${coin}-USD/ticker`;
fetch(currentPriceURL)
  .then(res => res.json())
  .then(data => {
    const currentPrice = parseFloat(data.price);
    const currentValue = totalSold * currentPrice;
    const totalProfitLoss = (totalRevenue - totalCost) - totalFees;
    const unrealizedProfitLoss = (totalSold * currentPrice) - (totalBought * currentPrice);

    console.log(`Total profit/loss for ${coin}: ${totalProfitLoss}`);
    console.log(`Unrealized profit/loss for ${coin}: ${unrealizedProfitLoss}`);
  })
  .catch(err => console.error(err));
