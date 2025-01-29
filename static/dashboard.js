document.addEventListener("DOMContentLoaded", function () {
    fetch('/expenses_json')
        .then(response => response.json())
        .then(data => {
            const categories = data.map(item => item[0]);
            const amounts = data.map(item => item[1]);

            const totalExpenses = amounts.reduce((acc, val) => acc + val, 0);
            const totalIncome = localStorage.getItem("totalIncome") || 0;
            const remainingBalance = totalIncome - totalExpenses;

            document.getElementById("totalIncome").innerText = `$${totalIncome}`;
            document.getElementById("totalExpenses").innerText = `$${totalExpenses}`;
            document.getElementById("remainingBalance").innerText = `$${remainingBalance}`;

            const ctxPie = document.getElementById("expenseChart").getContext("2d");
            new Chart(ctxPie, {
                type: "pie",
                data: {
                    labels: [...categories, "Remaining Balance"],
                    datasets: [{
                        data: [...amounts, remainingBalance],
                        backgroundColor: ["#007bff", "#ff4c4c", "#4caf50", "#ffb400"],
                        hoverOffset: 10
                    }]
                }
            });

            const ctxLine = document.getElementById("trendChart").getContext("2d");
            new Chart(ctxLine, {
                type: "line",
                data: {
                    labels: categories,
                    datasets: [{
                        label: "Spending Over Time",
                        data: amounts,
                        borderColor: "#ff4c4c",
                        fill: false,
                        tension: 0.4
                    }]
                }
            });
        });
});
