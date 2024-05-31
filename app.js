document.addEventListener('DOMContentLoaded', function () {
    let sampleExpenses = JSON.parse(localStorage.getItem('expenses')) || [];

    function saveExpensesToLocalStorage() {
        localStorage.setItem('expenses', JSON.stringify(sampleExpenses));
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username === 'admin' && password === 'admin') {
                showToast('U bent succesvol ingelogd!', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                showToast('Ongeldige gebruikersnaam of wachtwoord.', 'error');
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

    const passwordToggle = document.getElementById('password-toggle');
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function () {
            togglePasswordVisibility();
        });
    }

    const logoutButton = document.querySelector('.logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            showToast('U bent succesvol uitgelogd!', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        });
    }

    function updateDashboard() {
        const dashboardTable = document.getElementById('dashboard-table');
        dashboardTable.innerHTML = '';

        if (sampleExpenses.length === 0) {
            const noExpensesMessage = document.createElement('div');
            noExpensesMessage.className = 'text-left text-gray-400 p-4';
            noExpensesMessage.textContent = 'Voeg eerst uitgaven toe om dashboard te zien.';
            dashboardTable.appendChild(noExpensesMessage);
        } else {
            const categoryTotals = {};
            sampleExpenses.forEach(expense => {
                if (!categoryTotals[expense.category]) {
                    categoryTotals[expense.category] = 0;
                }
                categoryTotals[expense.category] += expense.amount;
            });

            const sortedCategories = Object.keys(categoryTotals).sort((a, b) => categoryTotals[b] - categoryTotals[a]);

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

        const noExpensesMessage = document.querySelector('.no-expenses');
        if (noExpensesMessage) {
            noExpensesMessage.remove();
        }

        const listItem = document.createElement('li');
        listItem.className = 'category-item fade-in';

        const expenseText = document.createElement('span');
        expenseText.textContent = `${expense.category}: €${expense.amount}`;
        expenseText.className = 'category-name';

        const expenseTime = document.createElement('span');
        const formattedDate = new Date(expense.timestamp).toLocaleString('nl-NL');
        expenseTime.innerHTML = `<i class="mr-1 fas fa-clock"></i> ${formattedDate}`;
        expenseTime.className = 'expense-time';

        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.className = 'edit-button text-yellow-500 bg-yellow-500/20 hover:bg-yellow-500/50 hover:text-white transition-all px-2 py-1 rounded-md';
        editButton.addEventListener('click', function () {
            openEditModal(expense);
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.className = 'delete-button text-red-500 bg-red-500/20 hover:bg-red-500/50 hover:text-white transition-all px-2 py-1 rounded-md';
        deleteButton.addEventListener('click', function () {
            deleteExpense(expense);
        });

        listItem.appendChild(expenseText);
        listItem.appendChild(expenseTime);
        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);
        expenseList.prepend(listItem);
        saveExpensesToLocalStorage();
    }

    function displayExpenses() {
        const expenseList = document.getElementById('expense-list');
        expenseList.innerHTML = '';
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

    function showToast(message, type) {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast px-4 py-2 rounded-md text-white shadow-sm ${type === 'success' ? 'toast-success' : 'toast-error'}`;

        const icon = document.createElement('i');
        icon.className = `fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`;

        toast.appendChild(icon);
        toast.appendChild(document.createTextNode(message));

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hide');
            setTimeout(() => {
                toast.remove();
            }, 500);
        }, 3000);
    }

    function openEditModal(expense) {
        const editModal = document.getElementById('edit-modal');
        const editAmount = document.getElementById('edit-amount');
        const editCategory = document.getElementById('edit-category');

        editAmount.value = expense.amount;
        editCategory.value = expense.category;

        editModal.dataset.id = expense.id;
        editModal.style.display = 'flex';
    }

    function closeEditModal() {
        const editModal = document.getElementById('edit-modal');
        editModal.style.display = 'none';
    }

    function saveEditedExpense() {
        const editModal = document.getElementById('edit-modal');
        const editAmount = document.getElementById('edit-amount').value;
        const editCategory = document.getElementById('edit-category').value;
        const expenseId = editModal.dataset.id;

        const expenseIndex = sampleExpenses.findIndex(exp => exp.id === expenseId);
        if (expenseIndex !== -1) {
            sampleExpenses[expenseIndex].amount = parseFloat(editAmount);
            sampleExpenses[expenseIndex].category = editCategory;

            saveExpensesToLocalStorage();
            displayExpenses();
            updateDashboard();
            showToast('Uitgave bijgewerkt.', 'success');
        } else {
            showToast('Fout bij het bijwerken van de uitgave.', 'error');
        }

        closeEditModal();
    }

    function deleteExpense(expense) {
        sampleExpenses = sampleExpenses.filter(exp => exp.id !== expense.id);
        saveExpensesToLocalStorage();
        displayExpenses();
        updateDashboard();
        showToast('Uitgave verwijderd.', 'success');
    }
    const expenseForm = document.getElementById('expense-form');
    expenseForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const amountInput = document.getElementById('amount');
        const categoryInput = document.getElementById('category');

        const amount = parseFloat(amountInput.value);
        const category = categoryInput.value;

        if (!amount || !category) {
            showToast('Vul alle velden in!', 'error');
            return; // Exit the function if either amount or category is missing
        }

        const newExpense = {
            id: Date.now().toString(),
            amount: amount,
            category: category,
            timestamp: new Date().toISOString()
        };

        sampleExpenses.push(newExpense);
        addExpenseToList(newExpense);
        updateDashboard();
        showToast('Uitgave van €' + amount + ' voor ' + category + ' is toegevoegd.', 'success');
        expenseForm.reset();
    });


    const saveEditButton = document.getElementById('save-edit-button');
    const cancelEditButton = document.getElementById('cancel-edit-button');
    saveEditButton.addEventListener('click', saveEditedExpense);
    cancelEditButton.addEventListener('click', closeEditModal);

    displayExpenses();
    updateDashboard();
});
