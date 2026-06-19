/**
 * =========================================================
 * Passenger Management System - Frontend JavaScript
 * Complete client-side logic for all pages
 * =========================================================
 */

// ==================== CONFIGURATION ====================
const API_BASE = ''; // Same origin; adjust if deploying differently

// ==================== TOAST NOTIFICATIONS ====================

/**
 * Shows a toast notification
 * @param {string} message - The message to display
 * @param {string} type - 'success', 'error', or 'warning'
 */
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const iconSvg = type === 'success'
        ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
        : type === 'error'
        ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';

    toast.innerHTML = `
        <div class="toast-icon">${iconSvg}</div>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
    `;

    container.appendChild(toast);

    // Auto remove after 4 seconds
    setTimeout(() => {
        toast.classList.add('toast-exit');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ==================== SESSION MANAGEMENT ====================

/**
 * Checks if user is authenticated. Redirects to login if not.
 * Also updates user info in sidebar if available.
 */
function checkAuth() {
    const fullName = sessionStorage.getItem('fullName');
    const userId = sessionStorage.getItem('userId');

    if (!fullName || !userId) {
        // Not logged in, redirect to login
        if (!window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('/')) {
            window.location.href = 'index.html';
            return;
        }
    }

    // Update user info in sidebar
    const userNameEl = document.getElementById('userName');
    const userAvatarEl = document.getElementById('userAvatar');
    if (userNameEl && fullName) {
        userNameEl.textContent = fullName;
    }
    if (userAvatarEl && fullName) {
        userAvatarEl.textContent = fullName.charAt(0).toUpperCase();
    }
}

// ==================== LOGIN ====================

/**
 * Handles login form submission
 */
function handleLogin(event) {
    event.preventDefault();
    clearErrors();

    const userId = document.getElementById('userId').value.trim();
    const password = document.getElementById('password').value;

    let isValid = true;

    // Validate User ID
    if (!userId) {
        showError('userIdError', 'User ID is required.');
        isValid = false;
    } else if (userId.length < 8) {
        showError('userIdError', 'User ID must be at least 8 characters.');
        isValid = false;
    } else if (!/^[a-zA-Z0-9]+$/.test(userId)) {
        showError('userIdError', 'User ID must be alphabetic or alphanumeric.');
        isValid = false;
    }

    // Validate Password
    if (!password) {
        showError('passwordError', 'Password is required.');
        isValid = false;
    } else if (password.length < 10) {
        showError('passwordError', 'Password must be at least 10 characters.');
        isValid = false;
    } else if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{10,}$/.test(password)) {
        showError('passwordError', 'Password must contain 1 uppercase, 1 number, and 1 special character.');
        isValid = false;
    }

    if (!isValid) return false;

    // Show loading
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.classList.add('loading');

    fetch(API_BASE + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password })
    })
    .then(res => res.json())
    .then(data => {
        loginBtn.classList.remove('loading');
        if (data.status === 'success') {
            // Store session info
            sessionStorage.setItem('userId', userId);
            sessionStorage.setItem('fullName', data.fullName);
            showToast(data.message, 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 800);
        } else {
            showToast(data.message, 'error');
        }
    })
    .catch(err => {
        loginBtn.classList.remove('loading');
        showToast('Connection error. Please check if the server is running.', 'error');
        console.error('Login error:', err);
    });

    return false;
}

/**
 * Toggle password visibility
 */
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
    } else {
        passwordInput.type = 'password';
        eyeIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
    }
}

/**
 * Handle logout
 */
function handleLogout() {
    sessionStorage.clear();

    fetch(API_BASE + '/login', { method: 'DELETE' })
    .catch(() => {})
    .finally(() => {
        window.location.href = 'index.html';
    });
}

// ==================== SIDEBAR ====================

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
}

// ==================== DASHBOARD ====================

/**
 * Load dashboard statistics
 */
function loadDashboardStats() {
    fetch(API_BASE + '/viewPassengers')
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            const totalEl = document.getElementById('totalPassengers');
            const revenueEl = document.getElementById('totalRevenue');
            const recentEl = document.getElementById('recentBookings');

            if (totalEl) animateCounter(totalEl, data.totalPassengers);
            if (revenueEl) animateCounter(revenueEl, data.totalRevenue, '₹');
            if (recentEl) animateCounter(recentEl, data.totalPassengers);
        }
    })
    .catch(err => {
        console.error('Dashboard stats error:', err);
    });
}

/**
 * Animate counter from 0 to target
 */
function animateCounter(element, target, prefix = '') {
    let current = 0;
    const increment = target / 40;
    const isFloat = !Number.isInteger(target);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = prefix + (isFloat ? current.toFixed(2) : Math.floor(current)).toLocaleString('en-IN');
    }, 25);
}

// ==================== ADD PASSENGER ====================

/**
 * Handle add passenger form submission
 */
function handleAddPassenger(event) {
    event.preventDefault();
    clearErrors();

    const pnrNumber = document.getElementById('pnrNumber').value.trim();
    const passengerName = document.getElementById('passengerName').value.trim();
    const age = document.getElementById('age').value.trim();
    const gender = document.getElementById('gender').value;
    const origin = document.getElementById('origin').value.trim();
    const destination = document.getElementById('destination').value.trim();
    const trainNumber = document.getElementById('trainNumber').value.trim();
    const ticketPrice = document.getElementById('ticketPrice').value.trim();

    let isValid = true;

    if (!pnrNumber) { showError('pnrError', 'PNR Number is required.'); isValid = false; }
    if (!passengerName) { showError('nameError', 'Passenger Name is required.'); isValid = false; }
    else if (/[^a-zA-Z\s.]/.test(passengerName)) { showError('nameError', 'Name should only contain letters, spaces, and dots.'); isValid = false; }

    if (!age) { showError('ageError', 'Age is required.'); isValid = false; }
    else if (parseInt(age) <= 0 || parseInt(age) > 120) { showError('ageError', 'Age must be between 1 and 120.'); isValid = false; }

    if (!gender) { showError('genderError', 'Gender is required.'); isValid = false; }
    if (!origin) { showError('originError', 'Origin is required.'); isValid = false; }
    if (!destination) { showError('destinationError', 'Destination is required.'); isValid = false; }
    if (!trainNumber) { showError('trainError', 'Train Number is required.'); isValid = false; }

    if (!ticketPrice) { showError('priceError', 'Ticket Price is required.'); isValid = false; }
    else if (parseFloat(ticketPrice) <= 0) { showError('priceError', 'Ticket Price must be greater than 0.'); isValid = false; }

    if (!isValid) return false;

    const addBtn = document.getElementById('addBtn');
    addBtn.classList.add('loading');

    fetch(API_BASE + '/addPassenger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pnrNumber, passengerName, age, gender, origin, destination, trainNumber, ticketPrice })
    })
    .then(res => res.json())
    .then(data => {
        addBtn.classList.remove('loading');
        if (data.status === 'success') {
            showToast(data.message, 'success');
            document.getElementById('addPassengerForm').reset();
        } else {
            showToast(data.message, 'error');
        }
    })
    .catch(err => {
        addBtn.classList.remove('loading');
        showToast('Connection error. Please check if the server is running.', 'error');
        console.error('Add passenger error:', err);
    });

    return false;
}

// ==================== UPDATE PASSENGER ====================

/**
 * Search passenger for update
 */
function searchForUpdate() {
    const pnr = document.getElementById('searchPnrUpdate').value.trim();
    if (!pnr) {
        showToast('Please enter a PNR Number.', 'warning');
        return;
    }

    fetch(API_BASE + '/searchPassenger?pnr=' + encodeURIComponent(pnr))
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            const p = data.passenger;
            document.getElementById('updatePnr').value = p.pnrNumber;
            document.getElementById('updateName').value = p.passengerName;
            document.getElementById('updateAge').value = p.age;
            document.getElementById('updateGender').value = p.gender;
            document.getElementById('updateOrigin').value = p.origin;
            document.getElementById('updateDestination').value = p.destination;
            document.getElementById('updateTrain').value = p.trainNumber;
            document.getElementById('updatePrice').value = p.ticketPrice;
            document.getElementById('updateFormCard').style.display = 'block';
            showToast('Passenger found! You can now edit the details.', 'success');
        } else {
            document.getElementById('updateFormCard').style.display = 'none';
            showToast(data.message, 'error');
        }
    })
    .catch(err => {
        showToast('Connection error.', 'error');
        console.error('Search for update error:', err);
    });
}

/**
 * Handle update passenger form submission
 */
function handleUpdatePassenger(event) {
    event.preventDefault();
    clearErrors();

    const pnrNumber = document.getElementById('updatePnr').value.trim();
    const passengerName = document.getElementById('updateName').value.trim();
    const age = document.getElementById('updateAge').value.trim();
    const gender = document.getElementById('updateGender').value;
    const origin = document.getElementById('updateOrigin').value.trim();
    const destination = document.getElementById('updateDestination').value.trim();
    const trainNumber = document.getElementById('updateTrain').value.trim();
    const ticketPrice = document.getElementById('updatePrice').value.trim();

    let isValid = true;

    if (!passengerName) { showError('updateNameError', 'Name is required.'); isValid = false; }
    if (!age || parseInt(age) <= 0 || parseInt(age) > 120) { showError('updateAgeError', 'Age must be 1-120.'); isValid = false; }
    if (!origin) { showError('updateOriginError', 'Origin is required.'); isValid = false; }
    if (!destination) { showError('updateDestinationError', 'Destination is required.'); isValid = false; }
    if (!trainNumber) { showError('updateTrainError', 'Train Number is required.'); isValid = false; }
    if (!ticketPrice || parseFloat(ticketPrice) <= 0) { showError('updatePriceError', 'Price must be > 0.'); isValid = false; }

    if (!isValid) return false;

    const updateBtn = document.getElementById('updateBtn');
    updateBtn.classList.add('loading');

    fetch(API_BASE + '/updatePassenger', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pnrNumber, passengerName, age, gender, origin, destination, trainNumber, ticketPrice })
    })
    .then(res => res.json())
    .then(data => {
        updateBtn.classList.remove('loading');
        if (data.status === 'success') {
            showToast(data.message, 'success');
        } else {
            showToast(data.message, 'error');
        }
    })
    .catch(err => {
        updateBtn.classList.remove('loading');
        showToast('Connection error.', 'error');
        console.error('Update error:', err);
    });

    return false;
}

// ==================== DELETE PASSENGER ====================

let deletePnrNumber = '';

/**
 * Search passenger for delete
 */
function searchForDelete() {
    const pnr = document.getElementById('searchPnrDelete').value.trim();
    if (!pnr) {
        showToast('Please enter a PNR Number.', 'warning');
        return;
    }

    fetch(API_BASE + '/searchPassenger?pnr=' + encodeURIComponent(pnr))
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('deleteResultCard');
        if (data.status === 'success') {
            const p = data.passenger;
            deletePnrNumber = p.pnrNumber;
            container.style.display = 'block';
            container.innerHTML = `
                <div class="result-card">
                    <div class="result-header">
                        <span class="pnr-tag">${p.pnrNumber}</span>
                        <h4>${p.passengerName}</h4>
                    </div>
                    <div class="result-grid">
                        <div class="result-item"><div class="result-label">Age</div><div class="result-value">${p.age}</div></div>
                        <div class="result-item"><div class="result-label">Gender</div><div class="result-value">${p.gender}</div></div>
                        <div class="result-item"><div class="result-label">Origin</div><div class="result-value">${p.origin}</div></div>
                        <div class="result-item"><div class="result-label">Destination</div><div class="result-value">${p.destination}</div></div>
                        <div class="result-item"><div class="result-label">Train Number</div><div class="result-value">${p.trainNumber}</div></div>
                        <div class="result-item"><div class="result-label">Ticket Price</div><div class="result-value" style="color:var(--color-green);">₹${p.ticketPrice.toLocaleString('en-IN')}</div></div>
                    </div>
                    <div class="btn-group" style="margin-top:24px;">
                        <button class="btn btn-danger" onclick="openDeleteModal()">Delete Passenger</button>
                        <button class="btn btn-outline" onclick="document.getElementById('deleteResultCard').style.display='none';">Cancel</button>
                    </div>
                </div>
            `;
            showToast('Passenger found. Review details before deleting.', 'success');
        } else {
            container.style.display = 'none';
            showToast(data.message, 'error');
        }
    })
    .catch(err => {
        showToast('Connection error.', 'error');
        console.error('Search for delete error:', err);
    });
}

function openDeleteModal() {
    document.getElementById('deleteModal').classList.add('active');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
}

/**
 * Confirm and execute delete (from delete page)
 */
function confirmDelete() {
    closeDeleteModal();

    fetch(API_BASE + '/deletePassenger?pnr=' + encodeURIComponent(deletePnrNumber), {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            showToast(data.message, 'success');
            document.getElementById('deleteResultCard').style.display = 'none';
            document.getElementById('searchPnrDelete').value = '';
        } else {
            showToast(data.message, 'error');
        }
    })
    .catch(err => {
        showToast('Connection error.', 'error');
        console.error('Delete error:', err);
    });
}

// ==================== VIEW ALL PASSENGERS ====================

let allPassengers = [];
let filteredPassengers = [];
let currentPage = 1;
const rowsPerPage = 10;
let sortColumn = -1;
let sortDirection = 'asc';
let deleteFromTablePnr = '';

/**
 * Load all passengers for the view page
 */
function loadAllPassengers() {
    fetch(API_BASE + '/viewPassengers')
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            allPassengers = data.passengers;
            filteredPassengers = [...allPassengers];
            document.getElementById('totalCount').textContent = allPassengers.length;
            renderTable();
        } else {
            showToast(data.message || 'Failed to load passengers.', 'error');
        }
    })
    .catch(err => {
        showToast('Connection error. Please check if the server is running.', 'error');
        console.error('Load passengers error:', err);
    });
}

/**
 * Render table with current page data
 */
function renderTable() {
    const tbody = document.getElementById('passengerTableBody');
    const emptyState = document.getElementById('emptyState');

    if (!tbody) return;

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = filteredPassengers.slice(start, end);

    if (filteredPassengers.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        tbody.innerHTML = pageData.map(p => {
            const genderClass = p.gender.toLowerCase();
            return `<tr>
                <td><span class="pnr-badge">${escapeHtml(p.pnrNumber)}</span></td>
                <td>${escapeHtml(p.passengerName)}</td>
                <td>${p.age}</td>
                <td><span class="gender-badge ${genderClass}">${escapeHtml(p.gender)}</span></td>
                <td>${escapeHtml(p.origin)}</td>
                <td>${escapeHtml(p.destination)}</td>
                <td>${escapeHtml(p.trainNumber)}</td>
                <td><span class="price-text">₹${p.ticketPrice.toLocaleString('en-IN')}</span></td>
                <td>
                    <div class="actions-cell">
                        <button class="action-btn edit" title="Edit" onclick="editPassenger('${escapeHtml(p.pnrNumber)}')">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="action-btn delete" title="Delete" onclick="deleteFromTable('${escapeHtml(p.pnrNumber)}')">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </td>
            </tr>`;
        }).join('');
    }

    renderPagination();
}

/**
 * Render pagination controls
 */
function renderPagination() {
    const totalPages = Math.ceil(filteredPassengers.length / rowsPerPage);
    const paginationInfo = document.getElementById('paginationInfo');
    const paginationControls = document.getElementById('paginationControls');

    if (!paginationInfo || !paginationControls) return;

    const start = filteredPassengers.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
    const end = Math.min(currentPage * rowsPerPage, filteredPassengers.length);
    paginationInfo.textContent = `Showing ${start}-${end} of ${filteredPassengers.length}`;

    let html = `<button class="page-btn" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
    </button>`;

    for (let i = 1; i <= totalPages; i++) {
        if (totalPages > 7 && i > 3 && i < totalPages - 2 && Math.abs(i - currentPage) > 1) {
            if (i === 4) html += `<button class="page-btn" disabled>...</button>`;
            continue;
        }
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }

    html += `<button class="page-btn" onclick="goToPage(${currentPage + 1})" ${currentPage >= totalPages ? 'disabled' : ''}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
    </button>`;

    paginationControls.innerHTML = html;
}

function goToPage(page) {
    const totalPages = Math.ceil(filteredPassengers.length / rowsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderTable();
}

/**
 * Filter table by search query
 */
function filterTable() {
    const query = document.getElementById('tableSearch').value.toLowerCase().trim();
    filteredPassengers = allPassengers.filter(p =>
        p.pnrNumber.toLowerCase().includes(query) ||
        p.passengerName.toLowerCase().includes(query) ||
        p.origin.toLowerCase().includes(query) ||
        p.destination.toLowerCase().includes(query) ||
        p.trainNumber.toLowerCase().includes(query)
    );
    currentPage = 1;
    renderTable();
}

/**
 * Sort table by column index
 */
function sortTable(columnIndex) {
    if (sortColumn === columnIndex) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = columnIndex;
        sortDirection = 'asc';
    }

    const keys = ['pnrNumber', 'passengerName', 'age', 'gender', 'origin', 'destination', 'trainNumber', 'ticketPrice'];
    const key = keys[columnIndex];

    filteredPassengers.sort((a, b) => {
        let valA = a[key];
        let valB = b[key];

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    currentPage = 1;
    renderTable();
}

/**
 * Edit passenger from table (redirects to update page)
 */
function editPassenger(pnr) {
    window.location.href = 'updatePassenger.html?pnr=' + encodeURIComponent(pnr);
}

/**
 * Delete passenger from table
 */
function deleteFromTable(pnr) {
    deleteFromTablePnr = pnr;
    document.getElementById('deleteModal').classList.add('active');
}

function confirmDeleteFromTable() {
    closeDeleteModal();

    fetch(API_BASE + '/deletePassenger?pnr=' + encodeURIComponent(deleteFromTablePnr), {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            showToast(data.message, 'success');
            loadAllPassengers(); // Refresh table
        } else {
            showToast(data.message, 'error');
        }
    })
    .catch(err => {
        showToast('Connection error.', 'error');
        console.error('Delete from table error:', err);
    });
}

// ==================== SEARCH PASSENGER ====================

/**
 * Search passenger by PNR (search page)
 */
function searchPassenger() {
    const pnr = document.getElementById('searchPnr').value.trim();
    if (!pnr) {
        showToast('Please enter a PNR Number.', 'warning');
        return;
    }

    fetch(API_BASE + '/searchPassenger?pnr=' + encodeURIComponent(pnr))
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('searchResultContainer');
        if (data.status === 'success') {
            const p = data.passenger;
            container.innerHTML = `
                <div class="result-card">
                    <div class="result-header">
                        <span class="pnr-tag">${escapeHtml(p.pnrNumber)}</span>
                        <h4>${escapeHtml(p.passengerName)}</h4>
                    </div>
                    <div class="result-grid">
                        <div class="result-item"><div class="result-label">PNR Number</div><div class="result-value">${escapeHtml(p.pnrNumber)}</div></div>
                        <div class="result-item"><div class="result-label">Passenger Name</div><div class="result-value">${escapeHtml(p.passengerName)}</div></div>
                        <div class="result-item"><div class="result-label">Age</div><div class="result-value">${p.age} years</div></div>
                        <div class="result-item"><div class="result-label">Gender</div><div class="result-value">${escapeHtml(p.gender)}</div></div>
                        <div class="result-item"><div class="result-label">Origin</div><div class="result-value">${escapeHtml(p.origin)}</div></div>
                        <div class="result-item"><div class="result-label">Destination</div><div class="result-value">${escapeHtml(p.destination)}</div></div>
                        <div class="result-item"><div class="result-label">Train Number</div><div class="result-value">${escapeHtml(p.trainNumber)}</div></div>
                        <div class="result-item"><div class="result-label">Ticket Price</div><div class="result-value" style="color:var(--color-green); font-size:18px;">₹${p.ticketPrice.toLocaleString('en-IN')}</div></div>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="result-card" style="text-align:center;">
                    <div class="empty-state" style="padding:40px 20px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--color-red); opacity:0.6;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="8" x2="14" y2="14"></line><line x1="14" y1="8" x2="8" y2="14"></line></svg>
                        <h4 style="color:var(--color-red);">Passenger Not Found</h4>
                        <p>No passenger found with PNR number "<strong>${escapeHtml(pnr)}</strong>". Please check and try again.</p>
                    </div>
                </div>
            `;
        }
    })
    .catch(err => {
        showToast('Connection error. Please check if the server is running.', 'error');
        console.error('Search error:', err);
    });
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Show inline error message
 */
function showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = message;
        el.classList.add('visible');
    }
}

/**
 * Clear all inline errors
 */
function clearErrors() {
    document.querySelectorAll('.form-error').forEach(el => {
        el.classList.remove('visible');
        el.textContent = '';
    });
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}

// ==================== URL PARAMETER HANDLING ====================

/**
 * Auto-fill PNR on update page if coming from view table
 */
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const pnr = urlParams.get('pnr');

    if (pnr && document.getElementById('searchPnrUpdate')) {
        document.getElementById('searchPnrUpdate').value = pnr;
        searchForUpdate();
    }
});

// ==================== KEYBOARD SHORTCUTS ====================

document.addEventListener('keydown', function(e) {
    // Enter key on search inputs
    if (e.key === 'Enter') {
        if (document.activeElement.id === 'searchPnr') {
            searchPassenger();
        } else if (document.activeElement.id === 'searchPnrUpdate') {
            searchForUpdate();
        } else if (document.activeElement.id === 'searchPnrDelete') {
            searchForDelete();
        }
    }

    // Escape key to close modals
    if (e.key === 'Escape') {
        const modal = document.querySelector('.modal-overlay.active');
        if (modal) {
            modal.classList.remove('active');
        }
        closeSidebar();
    }
});
