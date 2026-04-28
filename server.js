const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ expenses: [] }));
}

function readData() {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
}

function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Generate unique ID
function generateId() {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// API Routes

// GET /expenses
app.get('/expenses', (req, res) => {
    try {
        const data = readData();
        // Sort by newest first
        const expenses = data.expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json(expenses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
});

// POST /add-expense
app.post('/add-expense', (req, res) => {
    try {
        const { amount, category, date, note, dailyFoodLimit } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Amount must be greater than 0' });
        }

        const newExpense = {
            id: generateId(),
            amount: Number(amount),
            category,
            note: note || '',
            date: date ? new Date(date).toISOString() : new Date().toISOString()
        };

        const data = readData();

        let limitExceeded = false;
        let nearLimit = false;
        let totalFoodSpentToday = 0;
        let message = "Expense added successfully.";

        if (category === 'food') {
            const todayStr = new Date().toDateString();
            totalFoodSpentToday = data.expenses
                .filter(e => e.category === 'food' && new Date(e.date).toDateString() === todayStr)
                .reduce((sum, e) => sum + e.amount, 0) + Number(amount);

            if (dailyFoodLimit && Number(dailyFoodLimit) > 0) {
                if (totalFoodSpentToday > Number(dailyFoodLimit)) {
                    limitExceeded = true;
                    message = "You have already exceeded your food budget for today.";
                } else if (totalFoodSpentToday >= Number(dailyFoodLimit) * 0.8) {
                    nearLimit = true;
                    message = "You're close to your daily food budget.";
                }
            }
        }

        data.expenses.push(newExpense);
        writeData(data);

        res.status(201).json({
            success: true,
            expense: newExpense,
            limitExceeded,
            nearLimit,
            totalFoodSpentToday,
            dailyFoodLimit: dailyFoodLimit ? Number(dailyFoodLimit) : 0,
            message
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add expense' });
    }
});

// DELETE /delete/:id
app.delete('/delete/:id', (req, res) => {
    try {
        const data = readData();
        const initialLength = data.expenses.length;
        data.expenses = data.expenses.filter(exp => exp.id !== req.params.id);

        if (data.expenses.length === initialLength) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        writeData(data);
        res.json({ message: 'Expense deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete expense' });
    }
});

// GET /insights
app.get('/insights', (req, res) => {
    try {
        const data = readData();
        let total = 0;
        const categoryBreakdown = {};

        data.expenses.forEach(exp => {
            total += exp.amount;
            if (categoryBreakdown[exp.category]) {
                categoryBreakdown[exp.category] += exp.amount;
            } else {
                categoryBreakdown[exp.category] = exp.amount;
            }
        });

        let message = "Looking good. Keep up the disciplined pacing.";

        if (total > 6000) {
            message = "🚨 High spending detected!";
        } else {
            const foodSpend = categoryBreakdown['food'] || 0;
            const transportSpend = categoryBreakdown['transport'] || 0;

            if (total > 0 && (foodSpend / total) > 0.4) {
                message = "🍔 Too much spent on food";
            } else if (total > 0 && (transportSpend / total) > 0.3) {
                message = "🚗 High transport costs. Consider alternatives.";
            }
        }

        res.json({
            total,
            categoryBreakdown,
            message
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to generate insights' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
