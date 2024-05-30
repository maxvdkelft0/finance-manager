document.addEventListener('DOMContentLoaded', function () {
    // Sample data (can be replaced with real data from backend)
    let sampleExpenses = JSON.parse(localStorage.getItem('expenses')) || [];

    function saveExpensesToLocalStorage() {
        localStorage.setItem('expenses', JSON.stringify(sampleExpenses));
    }

    // Login form submission event listener
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            console.log('test')
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Check login credentials
            if (username === 'admin' && password === 'admin') {
                showToast('Succesvol ingelogd.', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html'; // Redirect after showing toast
                }, 1000); // Delay to show the toast before redirecting
            } else {
                showToast('Ongeldige gebruikersnaam of wachtwoord.', 'error');
                // Clear input fields
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
            }
        });
    }

    function togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const eyeIcon = document.getElementById('eye-icon');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.classList.remove('fa-eye-slash');
            eyeIcon.classList.add('fa-eye');
        } else {
            passwordInput.type = 'password';
            eyeIcon.classList.remove('fa-eye');
            eyeIcon.classList.add('fa-eye-slash');
        }
    }

    // Event listener for password toggle button
    const passwordToggle = document.getElementById('password-toggle');
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function () {
            togglePasswordVisibility();
        });
    }

    // Event listener for logout button
    const logoutButton = document.querySelector('.logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            // Show logout toast
            showToast('Uitgelogd.', 'success');
            // Redirect to login page after showing the toast
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000); // Delay before redirecting
        });
    }


    // Function to update dashboard
    function updateDashboard() {
        const dashboardTable = document.getElementById('dashboard-table');
        dashboardTable.innerHTML = '';

        if (sampleExpenses.length === 0) {
            const noExpensesMessage = document.createElement('div');
            noExpensesMessage.className = 'text-left text-gray-400 p-4';
            noExpensesMessage.textContent = 'Voeg eerst uitgaven toe om dashboard te zien.';
            dashboardTable.appendChild(noExpensesMessage);
        } else {
            // Calculate total expenses for each category
            const categoryTotals = {};
            sampleExpenses.forEach(expense => {
                if (!categoryTotals[expense.category]) {
                    categoryTotals[expense.category] = 0;
                }
                categoryTotals[expense.category] += expense.amount;
            });

            // Sort categories by total expenses
            const sortedCategories = Object.keys(categoryTotals).sort((a, b) => categoryTotals[b] - categoryTotals[a]);

            // Display top 5 categories in the dashboard table
            dashboardTable.innerHTML = `
                <thead>
                    <tr>
                        <th class="text-lg pb-4">Categorie</th>
                        <th class="text-lg pb-4">Bedrag</th>
                    </tr>
                </thead>
                <tbody>
            `;
            for (let i = 0; i < Math.min(5, sortedCategories.length); i++) {
                const category = sortedCategories[i];
                const total = categoryTotals[category];
                dashboardTable.innerHTML += `
                    <tr>
                        <td>${category}</td>
                        <td>€${total.toFixed(2)}</td>
                    </tr>
                `;
            }
            dashboardTable.innerHTML += `</tbody>`;
            saveExpensesToLocalStorage();

        }
    }

    function addExpenseToList(expense) {
        const expenseList = document.getElementById('expense-list');

        // Remove "Geen uitgaven toegevoegd." message if it exists
        const noExpensesMessage = document.querySelector('.no-expenses');
        if (noExpensesMessage) {
            noExpensesMessage.remove();
        }

        const listItem = document.createElement('li');
        listItem.className = 'category-item fade-in'; // Add animation class

        const expenseText = document.createElement('span');
        expenseText.textContent = `${expense.category}: €${expense.amount}`;
        expenseText.className = 'category-name'; // Add class for styling

        const expenseTime = document.createElement('span');
        const formattedDate = new Date(expense.timestamp).toLocaleString('nl-NL');
        expenseTime.innerHTML = `<i class="fas fa-clock"></i> ${formattedDate}`;
        expenseTime.className = 'expense-time'; // Add class for styling

        listItem.appendChild(expenseText);
        listItem.appendChild(expenseTime);
        expenseList.prepend(listItem); // Use prepend instead of appendChild
        saveExpensesToLocalStorage();
    }

    // Define the displayExpenses function
    function displayExpenses() {
        const expenseList = document.getElementById('expense-list');
        expenseList.innerHTML = ''; // Clear previous content
        sampleExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
        if (sampleExpenses.length === 0) {
            const noExpensesMessage = document.createElement('li');
            noExpensesMessage.className = 'text-left text-gray-400 no-expenses';
            noExpensesMessage.textContent = 'Geen uitgaven toegevoegd.';
            expenseList.appendChild(noExpensesMessage);
        } else {
            sampleExpenses.forEach(expense => {
                addExpenseToList(expense);
            });
        }
    }


    // Function to show toast messages
    function showToast(message, type) {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast px-4 py-2 rounded-md text-white shadow-sm ${type === 'success' ? 'toast-success' : 'toast-error'}`;

        // Add icon based on the type of message
        const icon = document.createElement('i');
        icon.className = `fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`;

        toast.appendChild(icon);
        toast.appendChild(document.createTextNode(message));

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100); // Add delay to trigger transition

        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hide');
            setTimeout(() => {
                toast.remove();
            }, 500); // Wait for the fade out transition to finish
        }, 3000); // Duration to show the toast
    }

    // Display initial expenses and dashboard
    displayExpenses();
    updateDashboard();

    // Form submission event listener
    const expenseForm = document.getElementById('expense-form');
    expenseForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;

        // Validation
        if (isNaN(amount) || amount <= 0 || category.trim() === '') {
            showToast('Voer alstublieft een geldig bedrag en categorie in.', 'error');
            return;
        }

        const newExpense = { amount, category, timestamp: new Date() };

        // Nieuwe uitgave toevoegen aan de lijst
        sampleExpenses.push(newExpense);

        // Dashboard bijwerken
        updateDashboard();

        // Nieuwe uitgave weergeven met animatie
        addExpenseToList(newExpense);

        console.log('tsst')
        // Show success toast
        showToast('Uitgave succesvol toegevoegd.', 'success');

        // Formulier resetten
        expenseForm.reset();
    });

});
