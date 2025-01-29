from flask import Flask, render_template, request, redirect, url_for, jsonify
import sqlite3
import datetime

app = Flask(__name__)

# Database setup
DATABASE = 'expenses.db'

def init_db():
    """Initialize the database if it doesn't exist."""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS expenses (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        amount REAL,
                        category TEXT,
                        date TEXT
                      )''')
    conn.commit()
    conn.close()

init_db()

@app.route('/')
def index():
    """Render homepage with expense form and history."""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM expenses ORDER BY date DESC")
    expenses = cursor.fetchall()
    conn.close()

    return render_template('index.html', expenses=expenses)

@app.route('/add', methods=['POST'])
def add_expense():
    """Add a new expense entry."""
    amount = float(request.form['amount'])
    category = request.form['category']
    date = request.form['date'] if request.form['date'] else datetime.date.today().strftime("%Y-%m-%d")

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO expenses (amount, category, date) VALUES (?, ?, ?)", 
                   (amount, category, date))
    conn.commit()
    conn.close()

    return redirect(url_for('index'))

@app.route('/remove/<int:expense_id>', methods=['POST'])
def remove_expense(expense_id):
    """Remove an expense entry from the database."""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM expenses WHERE id = ?", (expense_id,))
    conn.commit()
    conn.close()

    return redirect(url_for('index'))

@app.route('/expenses_json')
def expenses_json():
    """Return expenses as JSON for visualization."""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("SELECT category, SUM(amount) FROM expenses GROUP BY category")
    data = cursor.fetchall()
    conn.close()

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
