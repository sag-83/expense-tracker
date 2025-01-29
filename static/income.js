document.getElementById("incomeForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const income = document.getElementById("incomeInput").value;
    localStorage.setItem("totalIncome", income);
    document.getElementById("totalIncome").innerText = `$${income}`;
    location.reload();
});
