const axios = require('axios'); 
const dotenv = require('dotenv');

// Load API credentials from .env file
dotenv.config(); 

const clientId = process.env.BANK_CLIENT_ID; 
const clientSecret = process.env.BANK_CLIENT_SECRET; 
const accessToken = process.env.BANK_ACCESS_TOKEN;

async function fetchTransactions() { try {
    // Check if the access token is available
    if (!accessToken) {
      // Authenticate and get access token (Replace this URL and parameters with your bank's API details)
      const authResponse = await axios.post('https://your-bank-api.com/auth/token', { client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials', scope: 'accounts',
      });
      // Save the access token
      accessToken = authResponse.data.access_token;
    }
    // Fetch transactions (Replace this URL with your bank's API endpoint)
    const transactionsResponse = await axios.get('https://your-bank-api.com/api/v1/transactions', { headers: { Authorization: `Bearer ${accessToken}`,
      },
    });
    // Return the transactions
    return transactionsResponse.data;
  } catch (error) {
    console.error('Error fetching transactions:', error.message); return null;
  }
}

function predictExpenses(transactions) { const currentDate = new Date(); const currentMonth = currentDate.getMonth(); const currentYear = currentDate.getFullYear(); let pastMonthsExpenses = []; let 
  pastMonthsCount = 3; // Number of past months to consider for averaging for (let i = 1; i <= pastMonthsCount; i++) {
    const month = (currentMonth - i + 12) % 12; const year = currentYear - (i <= currentMonth ? 0 : 1); const expenses = transactions .filter((transaction) => { const transactionDate = new Date(transaction.date); 
        return (
          transactionDate.getMonth() === month && transactionDate.getFullYear() === year && transaction.amount < 0 );
      })
      .reduce((total, transaction) => total + transaction.amount, 0); pastMonthsExpenses.push(expenses);
  }
  const averageExpenses = pastMonthsExpenses.reduce((total, expense) => total + expense, 0) / pastMonthsCount; return averageExpenses;
}

(async () => { try {
    // Fetch transactions from the bank's API
    const transactions = await fetchTransactions(); if (transactions) {
      // Predict next month's expenses based on transaction data
      const prediction = predictExpenses(transactions); console.log(`Predicted expenses for next month: ${prediction.toFixed(2)}`);
    } else {
      console.log('Could not fetch transactions or make a prediction.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
