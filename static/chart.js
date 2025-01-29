document.addEventListener("DOMContentLoaded", function () {
    fetch('/expenses_json')
        .then(response => response.json())
        .then(data => {
            const categories = data.map(item => item[0]);
            const amounts = data.map(item => item[1]);

            const totalExpenses = amounts.reduce((acc, val) => acc + val, 0);
            const totalIncome = localStorage.getItem("totalIncome") || 0;
            const remainingBalance = totalIncome - totalExpenses;

            const ctx = document.getElementById("expenseChart").getContext("2d");

            new Chart(ctx, {
                type: "pie",
                data: {
                    labels: [...categories, "Remaining Balance"],
                    datasets: [{
                        label: "Expense Breakdown",
                        data: [...amounts, remainingBalance],
                        backgroundColor: [
                            "#007bff", "#ff4c4c", "#4caf50", "#ffb400", "#9C27B0", "#28a745"
                        ],
                        hoverOffset: 10
                    }]
                }
            });

            document.getElementById("totalExpenses").innerText = `$${totalExpenses}`;
            document.getElementById("remainingBalance").innerText = `$${remainingBalance}`;
        });
});
