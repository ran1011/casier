// Dashboard Kasir Otomatis
// Sistem Kasir Lengkap dengan Fitur yang Diminta

// Inisialisasi variabel global
let currentOrder = [];
let menuItems = [];
let ordersHistory = [];
let inventoryItems = [];
let expenses = [];
let settings = {};
let revenueChart = null;

// Data default untuk sistem
const DEFAULT_SETTINGS = {
    cashierName: "Kasir Utama",
    currency: "฿",
    language: "id",
    whatsappNumber: "",
    telegramNumber: "",
    businessName: "Restoran Saya",
    businessAddress: "Jl. Contoh No. 123, Kota",
    businessPhone: "",
    receiptHeader: "Terima kasih telah berkunjung",
    receiptFooter: "Silakan datang kembali",
    receiptLogo: "",
    showTax: true,
    showQr: true,
    taxRate: 10,
    receiptWidth: 80,
    notifyNewOrder: true,
    notifyLowStock: true,
    notifyDailyReport: false,
    notifyMonthlyReport: false,
    autoBackup: true,
    backupFrequency: "daily"
};

const DEFAULT_MENU = [
    { id: 1, name: "Nasi Goreng Spesial", category: "makanan", price: 45, cost: 20, stock: 50, description: "Nasi goreng dengan telur, ayam, dan sayuran", image: "", sales: 120 },
    { id: 2, name: "Mie Goreng Jawa", category: "makanan", price: 40, cost: 18, stock: 40, description: "Mie goreng dengan bumbu khas Jawa", image: "", sales: 95 },
    { id: 3, name: "Ayam Bakar", category: "makanan", price: 55, cost: 25, stock: 30, description: "Ayam bakar dengan sambal khas", image: "", sales: 80 },
    { id: 4, name: "Es Teh Manis", category: "minuman", price: 10, cost: 3, stock: 100, description: "Es teh dengan gula", image: "", sales: 200 },
    { id: 5, name: "Jus Alpukat", category: "minuman", price: 25, cost: 12, stock: 60, description: "Jus alpukat dengan susu kental manis", image: "", sales: 75 },
    { id: 6, name: "Kopi Hitam", category: "minuman", price: 15, cost: 5, stock: 80, description: "Kopi hitam pilihan", image: "", sales: 110 },
    { id: 7, name: "Kentang Goreng", category: "snack", price: 20, cost: 8, stock: 70, description: "Kentang goreng renyah", image: "", sales: 65 },
    { id: 8, name: "Singkong Keju", category: "snack", price: 18, cost: 7, stock: 50, description: "Singkong goreng dengan keju", image: "", sales: 50 },
    { id: 9, name: "Sate Ayam (10 tusuk)", category: "makanan", price: 35, cost: 15, stock: 40, description: "Sate ayam dengan bumbu kacang", image: "", sales: 90 },
    { id: 10, name: "Bakso Malang", category: "makanan", price: 30, cost: 12, stock: 60, description: "Bakso dengan mie dan pangsit", image: "", sales: 85 }
];

const DEFAULT_INVENTORY = [
    { id: 1, name: "Beras", currentStock: 50, minimumStock: 10, unit: "kg", lastUpdated: "2023-10-20" },
    { id: 2, name: "Minyak Goreng", currentStock: 20, minimumStock: 5, unit: "liter", lastUpdated: "2023-10-22" },
    { id: 3, name: "Gula", currentStock: 15, minimumStock: 3, unit: "kg", lastUpdated: "2023-10-21" },
    { id: 4, name: "Telur", currentStock: 200, minimumStock: 50, unit: "pcs", lastUpdated: "2023-10-23" },
    { id: 5, name: "Ayam", currentStock: 25, minimumStock: 10, unit: "kg", lastUpdated: "2023-10-23" },
    { id: 6, name: "Kopi Bubuk", currentStock: 5, minimumStock: 2, unit: "kg", lastUpdated: "2023-10-19" },
    { id: 7, name: "Teh Celup", currentStock: 8, minimumStock: 3, unit: "pack", lastUpdated: "2023-10-18" }
];

const DEFAULT_EXPENSES = [
    { id: 1, description: "Beli beras 50kg", amount: 500, category: "bahan", date: "2023-10-20" },
    { id: 2, description: "Beli minyak goreng 20 liter", amount: 300, category: "bahan", date: "2023-10-22" },
    { id: 3, description: "Beli gas LPG 3 tabung", amount: 200, category: "operasional", date: "2023-10-15" },
    { id: 4, description: "Gaji karyawan", amount: 2500, category: "operasional", date: "2023-10-25" },
    { id: 5, description: "Beli peralatan dapur", amount: 350, category: "peralatan", date: "2023-10-10" }
];

// Fungsi inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    // Sembunyikan loading screen setelah 1.5 detik
    setTimeout(() => {
        document.getElementById('loading-screen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
        }, 500);
    }, 1500);
    
    // Muat data dari localStorage
    loadData();
    
    // Inisialisasi komponen
    initNavigation();
    initDateTime();
    initDashboard();
    initOrderSection();
    initMenuManagement();
    initHistorySection();
    initInventorySection();
    initQueueSection();
    initSettingsSection();
    initModals();
    initNotifications();
    
    // Tampilkan dashboard sebagai default
    showSection('dashboard');
    
    // Update data setiap 30 detik
    setInterval(updateDashboardData, 30000);
});

// Fungsi untuk memuat data dari localStorage
function loadData() {
    // Muat pengaturan
    const savedSettings = localStorage.getItem('cashier_settings');
    settings = savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
    
    // Muat menu
    const savedMenu = localStorage.getItem('cashier_menu');
    menuItems = savedMenu ? JSON.parse(savedMenu) : DEFAULT_MENU;
    
    // Muat riwayat order
    const savedOrders = localStorage.getItem('cashier_orders');
    ordersHistory = savedOrders ? JSON.parse(savedOrders) : [];
    
    // Muat inventory
    const savedInventory = localStorage.getItem('cashier_inventory');
    inventoryItems = savedInventory ? JSON.parse(savedInventory) : DEFAULT_INVENTORY;
    
    // Muat pengeluaran
    const savedExpenses = localStorage.getItem('cashier_expenses');
    expenses = savedExpenses ? JSON.parse(savedExpenses) : DEFAULT_EXPENSES;
    
    // Update tampilan dengan pengaturan
    updateUIWithSettings();
}

// Fungsi untuk menyimpan data ke localStorage
function saveData() {
    localStorage.setItem('cashier_settings', JSON.stringify(settings));
    localStorage.setItem('cashier_menu', JSON.stringify(menuItems));
    localStorage.setItem('cashier_orders', JSON.stringify(ordersHistory));
    localStorage.setItem('cashier_inventory', JSON.stringify(inventoryItems));
    localStorage.setItem('cashier_expenses', JSON.stringify(expenses));
    
    // Update status data
    document.getElementById('data-status').innerHTML = '<i class="fas fa-database"></i> Data tersimpan';
    setTimeout(() => {
        document.getElementById('data-status').innerHTML = '<i class="fas fa-database"></i> Data tersimpan lokal';
    }, 2000);
}

// Fungsi untuk memperbarui UI dengan pengaturan
function updateUIWithSettings() {
    // Update nama kasir
    document.getElementById('kasir-name').textContent = settings.cashierName;
    
    // Update mata uang
    document.getElementById('currency-symbol').textContent = settings.currency;
    
    // Update menu hari ini
    const today = new Date().getDay();
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const todayMenus = [
        "Nasi Goreng Spesial dan Ayam Bakar",
        "Mie Goreng Jawa dan Sate Ayam",
        "Ayam Bakar dan Bakso Malang",
        "Nasi Goreng Spesial dan Kentang Goreng",
        "Mie Goreng Jawa dan Singkong Keju",
        "Sate Ayam dan Bakso Malang",
        "Semua menu dengan diskon 10%"
    ];
    document.getElementById('today-menu-note').textContent = `${dayNames[today]}: ${todayMenus[today]}`;
}

// Fungsi untuk navigasi
function initNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Hapus kelas active dari semua item
            menuItems.forEach(i => i.classList.remove('active'));
            
            // Tambahkan kelas active ke item yang diklik
            this.classList.add('active');
            
            // Tampilkan section yang sesuai
            const target = this.getAttribute('data-target');
            showSection(target);
        });
    });
    
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', function() {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            showNotification('Berhasil logout', 'Anda telah keluar dari sistem kasir', 'info');
            // Di aplikasi nyata, ini akan mengarahkan ke halaman login
            // location.href = 'login.html';
        }
    });
}

// Fungsi untuk menampilkan section
function showSection(sectionId) {
    // Sembunyikan semua section
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Tampilkan section yang dipilih
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
        
        // Update judul halaman
        const pageTitle = document.getElementById('page-title');
        const sectionTitle = activeSection.querySelector('.section-header h2').textContent;
        pageTitle.textContent = sectionTitle.replace(/<i>.*<\/i>/, '').trim();
        
        // Update breadcrumb
        const breadcrumb = document.querySelector('.breadcrumb');
        breadcrumb.innerHTML = `<span>${pageTitle.textContent}</span>`;
        
        // Update data section jika diperlukan
        if (sectionId === 'dashboard') {
            updateDashboardData();
        } else if (sectionId === 'order') {
            renderMenuItems();
            updateOrderSummary();
        } else if (sectionId === 'menu-management') {
            renderMenuTable();
        } else if (sectionId === 'history') {
            renderHistoryList();
        } else if (sectionId === 'inventory') {
            renderInventoryTable();
            updateExpenseSummary();
        } else if (sectionId === 'queue') {
            renderQueue();
        }
    }
}

// Fungsi untuk inisialisasi tanggal dan waktu
function initDateTime() {
    function updateDateTime() {
        const now = new Date();
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const timeString = now.toLocaleTimeString('id-ID');
        const dateString = now.toLocaleDateString('id-ID', dateOptions);
        
        document.getElementById('current-date').textContent = dateString;
        document.getElementById('current-time').textContent = timeString;
    }
    
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

// Fungsi untuk inisialisasi dashboard
function initDashboard() {
    // Inisialisasi grafik
    initRevenueChart();
    
    // Update data dashboard
    updateDashboardData();
    
    // Refresh favorites button
    document.getElementById('refresh-favorites').addEventListener('click', function() {
        updateFavoritesList();
        showNotification('Berhasil memperbarui', 'Daftar menu favorit telah diperbarui', 'success');
    });
    
    // Print summary button
    document.getElementById('print-summary').addEventListener('click', function() {
        printDashboardSummary();
    });
    
    // Chart period controls
    const chartBtns = document.querySelectorAll('.chart-btn');
    chartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            chartBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const period = this.getAttribute('data-period');
            updateRevenueChart(period);
        });
    });
}

// Fungsi untuk mengupdate data dashboard
function updateDashboardData() {
    // Hitung pendapatan harian, mingguan, bulanan
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    let dailyIncome = 0;
    let weeklyIncome = 0;
    let monthlyIncome = 0;
    let todayOrdersCount = 0;
    let totalOrdersCount = ordersHistory.length;
    let completedOrdersCount = 0;
    let pendingOrdersCount = 0;
    
    ordersHistory.forEach(order => {
        const orderDate = new Date(order.timestamp);
        const orderDateStr = orderDate.toISOString().split('T')[0];
        
        // Pendapatan harian
        if (orderDateStr === today) {
            dailyIncome += order.total;
            todayOrdersCount++;
        }
        
        // Pendapatan mingguan
        if (orderDate >= startOfWeek) {
            weeklyIncome += order.total;
        }
        
        // Pendapatan bulanan
        if (orderDate >= startOfMonth) {
            monthlyIncome += order.total;
        }
        
        // Hitung order selesai dan pending
        if (order.status === 'completed') {
            completedOrdersCount++;
        } else if (order.status === 'pending' || order.status === 'preparing') {
            pendingOrdersCount++;
        }
    });
    
    // Update statistik
    document.getElementById('daily-income').textContent = formatCurrency(dailyIncome);
    document.getElementById('weekly-income').textContent = formatCurrency(weeklyIncome);
    document.getElementById('monthly-income').textContent = formatCurrency(monthlyIncome);
    document.getElementById('total-orders').textContent = totalOrdersCount;
    document.getElementById('today-orders').textContent = todayOrdersCount;
    document.getElementById('completed-orders').textContent = completedOrdersCount;
    document.getElementById('pending-orders').textContent = pendingOrdersCount;
    
    // Update ringkasan lainnya
    const averageOrder = todayOrdersCount > 0 ? dailyIncome / todayOrdersCount : 0;
    document.getElementById('average-order').textContent = formatCurrency(averageOrder);
    
    // Hitung menu terjual hari ini
    let menuSoldToday = 0;
    const todayOrders = ordersHistory.filter(order => {
        const orderDate = new Date(order.timestamp).toISOString().split('T')[0];
        return orderDate === today;
    });
    
    todayOrders.forEach(order => {
        menuSoldToday += order.items.reduce((sum, item) => sum + item.quantity, 0);
    });
    
    document.getElementById('menu-sold-today').textContent = menuSoldToday;
    
    // Update saldo saat ini
    const currentBalance = monthlyIncome - calculateTotalExpensesThisMonth();
    document.getElementById('current-balance').textContent = formatCurrency(currentBalance);
    
    // Update grafik
    updateRevenueChart('week');
    
    // Update menu favorit
    updateFavoritesList();
}

// Fungsi untuk menghitung total pengeluaran bulan ini
function calculateTotalExpensesThisMonth() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return expenses.reduce((total, expense) => {
        const expenseDate = new Date(expense.date);
        if (expenseDate >= startOfMonth) {
            return total + expense.amount;
        }
        return total;
    }, 0);
}

// Fungsi untuk menginisialisasi grafik pendapatan
function initRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    
    revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
            datasets: [{
                label: 'Pendapatan',
                data: [0, 0, 0, 0, 0, 0, 0],
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Pendapatan: ${formatCurrency(context.raw)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return settings.currency + value;
                        }
                    }
                }
            }
        }
    });
}

// Fungsi untuk memperbarui grafik pendapatan
function updateRevenueChart(period) {
    // Untuk demo, kita buat data acak
    const days = period === 'week' ? 7 : 30;
    const data = [];
    
    for (let i = 0; i < days; i++) {
        // Data acak dengan tren naik
        const baseValue = 500 + Math.random() * 1000;
        const trend = (days - i) * 50;
        data.push(Math.floor(baseValue + trend));
    }
    
    // Update label
    const labels = [];
    if (period === 'week') {
        labels.push(...['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']);
    } else {
        for (let i = 1; i <= 30; i++) {
            labels.push(`${i}`);
        }
    }
    
    revenueChart.data.labels = labels;
    revenueChart.data.datasets[0].data = data;
    revenueChart.update();
}

// Fungsi untuk memperbarui daftar menu favorit
function updateFavoritesList() {
    const favoritesList = document.getElementById('favorites-list');
    
    // Urutkan menu berdasarkan penjualan
    const sortedMenu = [...menuItems].sort((a, b) => {
        // Jika ada properti sales, gunakan itu
        const salesA = a.sales || 0;
        const salesB = b.sales || 0;
        return salesB - salesA;
    }).slice(0, 5); // Ambil 5 teratas
    
    if (sortedMenu.length === 0) {
        favoritesList.innerHTML = `
            <div class="no-data">
                <i class="fas fa-utensils"></i>
                <p>Belum ada data penjualan</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    sortedMenu.forEach((item, index) => {
        const rankClass = `rank-${index + 1}`;
        html += `
            <div class="favorite-item">
                <div class="favorite-rank ${rankClass}">${index + 1}</div>
                <div class="favorite-info">
                    <h4>${item.name}</h4>
                    <p>Terjual: ${item.sales || 0} | Pendapatan: ${formatCurrency((item.sales || 0) * item.price)}</p>
                </div>
            </div>
        `;
    });
    
    favoritesList.innerHTML = html;
}

// Fungsi untuk mencetak ringkasan dashboard
function printDashboardSummary() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const printContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="text-align: center; color: #4361ee;">Ringkasan Dashboard Kasir</h2>
            <p style="text-align: center; margin-bottom: 30px;">${dateStr}</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                    <h3 style="margin-top: 0; color: #6c757d;">Pendapatan</h3>
                    <p>Harian: <strong>${document.getElementById('daily-income').textContent}</strong></p>
                    <p>Mingguan: <strong>${document.getElementById('weekly-income').textContent}</strong></p>
                    <p>Bulanan: <strong>${document.getElementById('monthly-income').textContent}</strong></p>
                </div>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                    <h3 style="margin-top: 0; color: #6c757d;">Pesanan</h3>
                    <p>Total: <strong>${document.getElementById('total-orders').textContent}</strong></p>
                    <p>Hari ini: <strong>${document.getElementById('today-orders').textContent}</strong></p>
                    <p>Selesai: <strong>${document.getElementById('completed-orders').textContent}</strong></p>
                </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
                <p style="text-align: center; color: #6c757d;">Dicetak pada ${now.toLocaleTimeString('id-ID')}</p>
            </div>
        </div>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Ringkasan Dashboard Kasir</title>
                <style>
                    @media print {
                        @page { margin: 0; }
                        body { margin: 1.6cm; }
                    }
                </style>
            </head>
            <body>
                ${printContent}
                <script>
                    window.onload = function() {
                        window.print();
                        window.onafterprint = function() {
                            window.close();
                        };
                    };
                </script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

// Fungsi untuk inisialisasi section order
function initOrderSection() {
    // Render menu items
    renderMenuItems();
    
    // Filter kategori
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            renderMenuItems(category);
        });
    });
    
    // Toggle delivery details
    const orderTypeRadios = document.querySelectorAll('input[name="order-type"]');
    const deliveryDetails = document.getElementById('delivery-details');
    
    orderTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'delivery') {
                deliveryDetails.style.display = 'block';
                // Set biaya delivery default
                document.getElementById('delivery-fee').textContent = formatCurrency(20);
            } else {
                deliveryDetails.style.display = 'none';
                document.getElementById('delivery-fee').textContent = formatCurrency(0);
            }
            updateOrderSummary();
        });
    });
    
    // Clear order button
    document.getElementById('clear-order').addEventListener('click', clearOrder);
    
    // Save order button
    document.getElementById('save-order').addEventListener('click', saveOrderDraft);
    
    // Process order button
    document.getElementById('process-order').addEventListener('click', processOrder);
    
    // Print receipt button
    document.getElementById('print-receipt').addEventListener('click', showReceiptModal);
}

// Fungsi untuk merender menu items
function renderMenuItems(category = 'all') {
    const menuList = document.getElementById('menu-list');
    
    // Filter menu berdasarkan kategori
    let filteredMenu = menuItems;
    if (category !== 'all') {
        filteredMenu = menuItems.filter(item => item.category === category);
    }
    
    if (filteredMenu.length === 0) {
        menuList.innerHTML = `
            <div class="no-data" style="grid-column: 1 / -1;">
                <i class="fas fa-utensils"></i>
                <p>Tidak ada menu dalam kategori ini</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    filteredMenu.forEach(item => {
        // Cek stok
        const stockStatus = item.stock > 0 ? 'Tersedia' : 'Habis';
        const stockClass = item.stock > 0 ? 'available' : 'out-of-stock';
        const isAvailable = item.stock > 0;
        
        html += `
            <div class="menu-item-card" data-id="${item.id}">
                <div class="menu-item-img">
                    ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover;">` : `<i class="fas fa-utensils"></i>`}
                </div>
                <div class="menu-item-info">
                    <h3 class="menu-item-name">${item.name}</h3>
                    <p class="menu-item-desc">${item.description}</p>
                    <div class="menu-item-footer">
                        <span class="menu-item-price">${formatCurrency(item.price)}</span>
                        <span class="stock-status ${stockClass}">${stockStatus}</span>
                        <button class="add-to-order" ${!isAvailable ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    menuList.innerHTML = html;
    
    // Tambahkan event listener untuk tombol tambah ke order
    document.querySelectorAll('.add-to-order').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.menu-item-card');
            const itemId = parseInt(card.getAttribute('data-id'));
            addToOrder(itemId);
        });
    });
    
    // Tambahkan event listener untuk klik card
    document.querySelectorAll('.menu-item-card').forEach(card => {
        card.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            const item = menuItems.find(m => m.id === itemId);
            if (item && item.stock > 0) {
                addToOrder(itemId);
            }
        });
    });
}

// Fungsi untuk menambahkan item ke order
function addToOrder(itemId) {
    const item = menuItems.find(m => m.id === itemId);
    if (!item) return;
    
    // Cek apakah item sudah ada di order
    const existingItem = currentOrder.find(i => i.id === itemId);
    
    if (existingItem) {
        // Tambah kuantitas jika sudah ada
        existingItem.quantity += 1;
    } else {
        // Tambah item baru
        currentOrder.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1
        });
    }
    
    // Update tampilan order
    updateOrderItems();
    updateOrderSummary();
    
    // Tampilkan notifikasi
    showNotification('Item ditambahkan', `${item.name} telah ditambahkan ke pesanan`, 'success');
}

// Fungsi untuk mengupdate daftar item dalam order
function updateOrderItems() {
    const orderItems = document.getElementById('order-items');
    
    if (currentOrder.length === 0) {
        orderItems.innerHTML = `
            <div class="no-order">
                <i class="fas fa-shopping-cart"></i>
                <p>Belum ada item dalam pesanan</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    currentOrder.forEach((item, index) => {
        html += `
            <div class="order-item">
                <div class="order-item-info">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-price">${formatCurrency(item.price)}</div>
                </div>
                <div class="order-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn decrease" data-index="${index}">-</button>
                        <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                        <button class="quantity-btn increase" data-index="${index}">+</button>
                    </div>
                    <button class="remove-item" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    orderItems.innerHTML = html;
    
    // Tambahkan event listener untuk kontrol kuantitas
    document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            decreaseQuantity(index);
        });
    });
    
    document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            increaseQuantity(index);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeOrderItem(index);
        });
    });
}

// Fungsi untuk mengurangi kuantitas item
function decreaseQuantity(index) {
    if (currentOrder[index]) {
        if (currentOrder[index].quantity > 1) {
            currentOrder[index].quantity -= 1;
            updateOrderItems();
            updateOrderSummary();
        } else {
            removeOrderItem(index);
        }
    }
}

// Fungsi untuk menambah kuantitas item
function increaseQuantity(index) {
    if (currentOrder[index]) {
        currentOrder[index].quantity += 1;
        updateOrderItems();
        updateOrderSummary();
    }
}

// Fungsi untuk menghapus item dari order
function removeOrderItem(index) {
    const itemName = currentOrder[index].name;
    currentOrder.splice(index, 1);
    updateOrderItems();
    updateOrderSummary();
    
    showNotification('Item dihapus', `${itemName} telah dihapus dari pesanan`, 'info');
}

// Fungsi untuk mengupdate ringkasan order
function updateOrderSummary() {
    // Hitung subtotal
    const subtotal = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Hitung biaya delivery
    const isDelivery = document.querySelector('input[name="order-type"]:checked').value === 'delivery';
    const deliveryFee = isDelivery ? 20 : 0;
    
    // Hitung total
    const total = subtotal + deliveryFee;
    
    // Update tampilan
    document.getElementById('order-subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('delivery-fee').textContent = formatCurrency(deliveryFee);
    document.getElementById('order-total').textContent = formatCurrency(total);
}

// Fungsi untuk menghapus semua order
function clearOrder() {
    if (currentOrder.length === 0) return;
    
    if (confirm('Apakah Anda yakin ingin menghapus semua item dari pesanan?')) {
        currentOrder = [];
        updateOrderItems();
        updateOrderSummary();
        showNotification('Pesanan dihapus', 'Semua item telah dihapus dari pesanan', 'info');
    }
}

// Fungsi untuk menyimpan draft order
function saveOrderDraft() {
    if (currentOrder.length === 0) {
        showNotification('Pesanan kosong', 'Tidak ada item untuk disimpan', 'warning');
        return;
    }
    
    // Simpan ke localStorage
    const draft = {
        items: currentOrder,
        orderType: document.querySelector('input[name="order-type"]:checked').value,
        deliveryAddress: document.getElementById('delivery-address').value,
        deliveryPhone: document.getElementById('delivery-phone').value,
        notes: document.getElementById('order-notes').value,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('cashier_order_draft', JSON.stringify(draft));
    showNotification('Draft disimpan', 'Pesanan telah disimpan sebagai draft', 'success');
}

// Fungsi untuk memproses order
function processOrder() {
    if (currentOrder.length === 0) {
        showNotification('Pesanan kosong', 'Tambahkan item terlebih dahulu', 'warning');
        return;
    }
    
    // Hitung total
    const subtotal = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const isDelivery = document.querySelector('input[name="order-type"]:checked').value === 'delivery';
    const deliveryFee = isDelivery ? 20 : 0;
    const total = subtotal + deliveryFee;
    
    // Tampilkan konfirmasi
    if (!confirm(`Proses pesanan dengan total ${formatCurrency(total)}?`)) {
        return;
    }
    
    // Kurangi stok
    let outOfStockItems = [];
    currentOrder.forEach(orderItem => {
        const menuItem = menuItems.find(m => m.id === orderItem.id);
        if (menuItem) {
            if (menuItem.stock >= orderItem.quantity) {
                menuItem.stock -= orderItem.quantity;
                // Tambah penjualan
                menuItem.sales = (menuItem.sales || 0) + orderItem.quantity;
            } else {
                outOfStockItems.push(menuItem.name);
            }
        }
    });
    
    if (outOfStockItems.length > 0) {
        showNotification('Stok tidak cukup', `Stok tidak cukup untuk: ${outOfStockItems.join(', ')}`, 'error');
        return;
    }
    
    // Buat order object
    const orderType = document.querySelector('input[name="order-type"]:checked').value;
    const order = {
        id: generateOrderId(),
        items: [...currentOrder],
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total,
        type: orderType,
        deliveryAddress: document.getElementById('delivery-address').value,
        deliveryPhone: document.getElementById('delivery-phone').value,
        notes: document.getElementById('order-notes').value,
        status: 'pending',
        timestamp: new Date().toISOString(),
        cashier: settings.cashierName
    };
    
    // Tambahkan ke riwayat
    ordersHistory.unshift(order);
    
    // Reset form
    currentOrder = [];
    document.getElementById('delivery-address').value = '';
    document.getElementById('delivery-phone').value = '';
    document.getElementById('order-notes').value = '';
    
    // Update tampilan
    updateOrderItems();
    updateOrderSummary();
    
    // Simpan data
    saveData();
    
    // Tampilkan notifikasi
    showNotification('Pesanan diproses', `Order #${order.id} telah diproses dengan total ${formatCurrency(total)}`, 'success');
    
    // Tampilkan struk
    showReceiptModal(order);
    
    // Update dashboard jika terbuka
    if (document.getElementById('dashboard').classList.contains('active')) {
        updateDashboardData();
    }
    
    // Update queue jika terbuka
    if (document.getElementById('queue').classList.contains('active')) {
        renderQueue();
    }
}

// Fungsi untuk menghasilkan ID order
function generateOrderId() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD${timestamp}${random}`;
}

// Fungsi untuk inisialisasi manajemen menu
function initMenuManagement() {
    // Render menu table
    renderMenuTable();
    
    // Form submission
    document.getElementById('menu-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveMenuItem();
    });
    
    // Clear form button
    document.getElementById('clear-form').addEventListener('click', function() {
        clearMenuForm();
    });
    
    // Delete menu button
    document.getElementById('delete-menu').addEventListener('click', function() {
        const menuId = document.getElementById('menu-id').value;
        if (menuId) {
            deleteMenuItem(parseInt(menuId));
        }
    });
    
    // Search functionality
    document.getElementById('menu-search').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filterMenuTable(searchTerm);
    });
}

// Fungsi untuk merender tabel menu
function renderMenuTable() {
    const tableBody = document.getElementById('menu-table-body');
    
    if (menuItems.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px;">
                    <i class="fas fa-utensils" style="font-size: 48px; color: #dee2e6; margin-bottom: 15px; display: block;"></i>
                    <p style="color: #6c757d;">Belum ada menu. Tambahkan menu baru.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    menuItems.forEach(item => {
        // Tentukan label kategori
        let categoryLabel = item.category;
        if (item.category === 'makanan') categoryLabel = 'Makanan';
        else if (item.category === 'minuman') categoryLabel = 'Minuman';
        else if (item.category === 'snack') categoryLabel = 'Snack';
        
        html += `
            <tr>
                <td>${item.name}</td>
                <td><span class="category-badge">${categoryLabel}</span></td>
                <td>${formatCurrency(item.price)}</td>
                <td>${item.stock}</td>
                <td>${formatCurrency(item.cost)}</td>
                <td>
                    <div class="actions">
                        <button class="table-btn edit" data-id="${item.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="table-btn delete" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
    
    // Tambahkan event listener untuk tombol edit dan hapus
    document.querySelectorAll('.table-btn.edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            editMenuItem(itemId);
        });
    });
    
    document.querySelectorAll('.table-btn.delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            if (confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
                deleteMenuItem(itemId);
            }
        });
    });
}

// Fungsi untuk filter tabel menu
function filterMenuTable(searchTerm) {
    const rows = document.querySelectorAll('#menu-table-body tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Fungsi untuk menyimpan menu item
function saveMenuItem() {
    const id = document.getElementById('menu-id').value;
    const name = document.getElementById('menu-name').value;
    const category = document.getElementById('menu-category').value;
    const price = parseFloat(document.getElementById('menu-price').value);
    const cost = parseFloat(document.getElementById('menu-cost').value);
    const stock = parseInt(document.getElementById('menu-stock').value);
    const image = document.getElementById('menu-image').value;
    const description = document.getElementById('menu-description').value;
    
    if (id) {
        // Edit menu yang ada
        const index = menuItems.findIndex(item => item.id === parseInt(id));
        if (index !== -1) {
            menuItems[index] = {
                ...menuItems[index],
                name,
                category,
                price,
                cost,
                stock,
                image,
                description
            };
            
            showNotification('Menu diperbarui', `${name} telah diperbarui`, 'success');
        }
    } else {
        // Tambah menu baru
        const newId = menuItems.length > 0 ? Math.max(...menuItems.map(item => item.id)) + 1 : 1;
        menuItems.push({
            id: newId,
            name,
            category,
            price,
            cost,
            stock,
            image,
            description,
            sales: 0
        });
        
        showNotification('Menu ditambahkan', `${name} telah ditambahkan ke daftar menu`, 'success');
    }
    
    // Simpan data
    saveData();
    
    // Reset form
    clearMenuForm();
    
    // Update tabel
    renderMenuTable();
    
    // Update menu di section order jika terbuka
    if (document.getElementById('order').classList.contains('active')) {
        renderMenuItems();
    }
}

// Fungsi untuk mengedit menu item
function editMenuItem(id) {
    const item = menuItems.find(m => m.id === id);
    if (!item) return;
    
    // Isi form
    document.getElementById('menu-id').value = item.id;
    document.getElementById('menu-name').value = item.name;
    document.getElementById('menu-category').value = item.category;
    document.getElementById('menu-price').value = item.price;
    document.getElementById('menu-cost').value = item.cost;
    document.getElementById('menu-stock').value = item.stock;
    document.getElementById('menu-image').value = item.image || '';
    document.getElementById('menu-description').value = item.description || '';
    
    // Tampilkan tombol hapus
    document.getElementById('delete-menu').style.display = 'block';
    
    // Scroll ke form
    document.querySelector('.menu-form-section').scrollIntoView({ behavior: 'smooth' });
}

// Fungsi untuk menghapus menu item
function deleteMenuItem(id) {
    const index = menuItems.findIndex(item => item.id === id);
    if (index !== -1) {
        const itemName = menuItems[index].name;
        menuItems.splice(index, 1);
        
        // Simpan data
        saveData();
        
        // Update tabel
        renderMenuTable();
        
        // Update menu di section order jika terbuka
        if (document.getElementById('order').classList.contains('active')) {
            renderMenuItems();
        }
        
        // Reset form
        clearMenuForm();
        
        showNotification('Menu dihapus', `${itemName} telah dihapus dari daftar menu`, 'info');
    }
}

// Fungsi untuk membersihkan form menu
function clearMenuForm() {
    document.getElementById('menu-form').reset();
    document.getElementById('menu-id').value = '';
    document.getElementById('delete-menu').style.display = 'none';
}

// Fungsi untuk inisialisasi section riwayat
function initHistorySection() {
    // Render history list
    renderHistoryList();
    
    // Filter controls
    document.getElementById('history-filter-date').addEventListener('change', renderHistoryList);
    document.getElementById('history-filter-status').addEventListener('change', renderHistoryList);
    document.getElementById('history-filter-type').addEventListener('change', renderHistoryList);
    
    // Export button
    document.getElementById('export-history').addEventListener('click', exportHistoryData);
}

// Fungsi untuk merender daftar riwayat
function renderHistoryList() {
    const historyList = document.getElementById('history-list');
    const dateFilter = document.getElementById('history-filter-date').value;
    const statusFilter = document.getElementById('history-filter-status').value;
    const typeFilter = document.getElementById('history-filter-type').value;
    
    // Filter orders
    let filteredOrders = [...ordersHistory];
    
    // Filter berdasarkan tanggal
    const now = new Date();
    if (dateFilter === 'today') {
        const today = now.toISOString().split('T')[0];
        filteredOrders = filteredOrders.filter(order => {
            const orderDate = new Date(order.timestamp).toISOString().split('T')[0];
            return orderDate === today;
        });
    } else if (dateFilter === 'week') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        filteredOrders = filteredOrders.filter(order => new Date(order.timestamp) >= startOfWeek);
    } else if (dateFilter === 'month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        filteredOrders = filteredOrders.filter(order => new Date(order.timestamp) >= startOfMonth);
    }
    
    // Filter berdasarkan status
    if (statusFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }
    
    // Filter berdasarkan tipe
    if (typeFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.type === typeFilter);
    }
    
    if (filteredOrders.length === 0) {
        historyList.innerHTML = `
            <div class="no-data" style="padding: 60px 20px;">
                <i class="fas fa-history"></i>
                <p>Tidak ada riwayat order dengan filter yang dipilih</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    filteredOrders.forEach(order => {
        const orderDate = new Date(order.timestamp);
        const dateStr = orderDate.toLocaleDateString('id-ID');
        const timeStr = orderDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        
        // Tentukan label tipe
        let typeLabel = order.type;
        let typeClass = order.type;
        if (order.type === 'dine-in') {
            typeLabel = 'Tempat Makan';
            typeClass = 'dine-in';
        } else if (order.type === 'delivery') {
            typeLabel = 'Delivery';
            typeClass = 'delivery';
        } else if (order.type === 'takeaway') {
            typeLabel = 'Takeaway';
            typeClass = 'takeaway';
        }
        
        // Tentukan label status
        let statusLabel = order.status;
        let statusClass = order.status;
        if (order.status === 'completed') {
            statusLabel = 'Selesai';
            statusClass = 'completed';
        } else if (order.status === 'pending') {
            statusLabel = 'Dalam Proses';
            statusClass = 'pending';
        } else if (order.status === 'preparing') {
            statusLabel = 'Sedang Disiapkan';
            statusClass = 'pending';
        } else if (order.status === 'cancelled') {
            statusLabel = 'Dibatalkan';
            statusClass = 'cancelled';
        }
        
        html += `
            <div class="history-item" data-id="${order.id}">
                <div class="history-info">
                    <h4>Order #${order.id}</h4>
                    <p>${dateStr} ${timeStr} • ${order.cashier}</p>
                    <div class="history-meta">
                        <span class="history-type ${typeClass}">${typeLabel}</span>
                        <span class="history-status ${statusClass}">${statusLabel}</span>
                    </div>
                </div>
                <div class="history-details">
                    <div class="history-amount">${formatCurrency(order.total)}</div>
                    <div class="history-actions">
                        <button class="btn secondary view-order-btn" data-id="${order.id}">
                            <i class="fas fa-eye"></i> Lihat
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    historyList.innerHTML = html;
    
    // Tambahkan event listener untuk tombol lihat
    document.querySelectorAll('.view-order-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.getAttribute('data-id');
            viewOrderDetails(orderId);
        });
    });
}

// Fungsi untuk melihat detail order
function viewOrderDetails(orderId) {
    const order = ordersHistory.find(o => o.id === orderId);
    if (!order) return;
    
    const orderDate = new Date(order.timestamp);
    const dateStr = orderDate.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const timeStr = orderDate.toLocaleTimeString('id-ID');
    
    // Tentukan label tipe
    let typeLabel = order.type;
    if (order.type === 'dine-in') typeLabel = 'Tempat Makan';
    else if (order.type === 'delivery') typeLabel = 'Delivery';
    else if (order.type === 'takeaway') typeLabel = 'Takeaway';
    
    // Tentukan label status
    let statusLabel = order.status;
    if (order.status === 'completed') statusLabel = 'Selesai';
    else if (order.status === 'pending') statusLabel = 'Dalam Proses';
    else if (order.status === 'preparing') statusLabel = 'Sedang Disiapkan';
    else if (order.status === 'cancelled') statusLabel = 'Dibatalkan';
    
    let itemsHtml = '';
    order.items.forEach(item => {
        itemsHtml += `
            <div class="receipt-item">
                <span>${item.name} x${item.quantity}</span>
                <span>${formatCurrency(item.price * item.quantity)}</span>
            </div>
        `;
    });
    
    const modalBody = document.getElementById('order-modal-body');
    modalBody.innerHTML = `
        <div class="order-details">
            <div class="detail-row">
                <span class="detail-label">ID Order:</span>
                <span class="detail-value">${order.id}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Tanggal:</span>
                <span class="detail-value">${dateStr} ${timeStr}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Kasir:</span>
                <span class="detail-value">${order.cashier}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Tipe Order:</span>
                <span class="detail-value">${typeLabel}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value">${statusLabel}</span>
            </div>
            
            ${order.type === 'delivery' ? `
                <div class="detail-row">
                    <span class="detail-label">Alamat Delivery:</span>
                    <span class="detail-value">${order.deliveryAddress || '-'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Telepon:</span>
                    <span class="detail-value">${order.deliveryPhone || '-'}</span>
                </div>
            ` : ''}
            
            ${order.notes ? `
                <div class="detail-row">
                    <span class="detail-label">Catatan:</span>
                    <span class="detail-value">${order.notes}</span>
                </div>
            ` : ''}
            
            <div class="detail-section">
                <h4>Items:</h4>
                <div class="order-items-list">
                    ${itemsHtml}
                </div>
            </div>
            
            <div class="detail-section">
                <div class="detail-row">
                    <span class="detail-label">Subtotal:</span>
                    <span class="detail-value">${formatCurrency(order.subtotal)}</span>
                </div>
                ${order.deliveryFee > 0 ? `
                    <div class="detail-row">
                        <span class="detail-label">Biaya Delivery:</span>
                        <span class="detail-value">${formatCurrency(order.deliveryFee)}</span>
                    </div>
                ` : ''}
                <div class="detail-row total">
                    <span class="detail-label">Total:</span>
                    <span class="detail-value">${formatCurrency(order.total)}</span>
                </div>
            </div>
        </div>
    `;
    
    // Simpan ID order untuk cetak ulang
    document.getElementById('reprint-receipt').setAttribute('data-order-id', order.id);
    
    // Tampilkan modal
    document.getElementById('order-modal').classList.add('active');
}

// Fungsi untuk mengekspor data riwayat
function exportHistoryData() {
    // Buat data CSV
    let csv = 'ID,Tanggal,Kasir,Tipe,Status,Subtotal,Biaya Delivery,Total\n';
    
    ordersHistory.forEach(order => {
        const orderDate = new Date(order.timestamp);
        const dateStr = orderDate.toISOString().split('T')[0];
        const timeStr = orderDate.toTimeString().split(' ')[0];
        
        // Tentukan label tipe
        let typeLabel = order.type;
        if (order.type === 'dine-in') typeLabel = 'Tempat Makan';
        else if (order.type === 'delivery') typeLabel = 'Delivery';
        else if (order.type === 'takeaway') typeLabel = 'Takeaway';
        
        // Tentukan label status
        let statusLabel = order.status;
        if (order.status === 'completed') statusLabel = 'Selesai';
        else if (order.status === 'pending') statusLabel = 'Dalam Proses';
        else if (order.status === 'preparing') statusLabel = 'Sedang Disiapkan';
        else if (order.status === 'cancelled') statusLabel = 'Dibatalkan';
        
        csv += `"${order.id}","${dateStr} ${timeStr}","${order.cashier}","${typeLabel}","${statusLabel}",${order.subtotal},${order.deliveryFee},${order.total}\n`;
    });
    
    // Buat blob dan download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `riwayat_order_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    showNotification('Data diekspor', 'Riwayat order telah diekspor ke file CSV', 'success');
}

// Fungsi untuk inisialisasi section inventory
function initInventorySection() {
    // Render inventory table
    renderInventoryTable();
    
    // Update expense summary
    updateExpenseSummary();
    
    // Add stock button
    document.getElementById('add-stock').addEventListener('click', function() {
        document.getElementById('stock-modal').classList.add('active');
    });
    
    // Low stock alert button
    document.getElementById('low-stock-alert').addEventListener('click', function() {
        checkLowStock();
    });
    
    // Add expense button
    document.getElementById('add-expense').addEventListener('click', addExpense);
    
    // Form stock submission
    document.getElementById('stock-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addStockItem();
    });
}

// Fungsi untuk merender tabel inventory
function renderInventoryTable() {
    const tableBody = document.getElementById('stock-table-body');
    
    if (inventoryItems.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px;">
                    <i class="fas fa-boxes" style="font-size: 48px; color: #dee2e6; margin-bottom: 15px; display: block;"></i>
                    <p style="color: #6c757d;">Belum ada data stok. Tambahkan stok baru.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    inventoryItems.forEach(item => {
        // Tentukan status stok
        let status = 'adequate';
        let statusLabel = 'Cukup';
        
        if (item.currentStock <= item.minimumStock * 0.3) {
            status = 'critical';
            statusLabel = 'Kritis';
        } else if (item.currentStock <= item.minimumStock) {
            status = 'low';
            statusLabel = 'Rendah';
        }
        
        html += `
            <tr>
                <td>${item.name}</td>
                <td>${item.currentStock} ${item.unit}</td>
                <td>${item.minimumStock} ${item.unit}</td>
                <td><span class="stock-status ${status}">${statusLabel}</span></td>
                <td>${item.lastUpdated}</td>
                <td>
                    <div class="actions">
                        <button class="table-btn edit" data-id="${item.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="table-btn delete" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
    
    // Tambahkan event listener untuk tombol edit dan hapus
    document.querySelectorAll('.table-btn.edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            // Untuk sederhana, kita tambahkan stok
            const item = inventoryItems.find(i => i.id === itemId);
            if (item) {
                const addAmount = prompt(`Tambahkan stok untuk ${item.name} (saat ini: ${item.currentStock} ${item.unit}):`, "10");
                if (addAmount && !isNaN(addAmount)) {
                    item.currentStock += parseInt(addAmount);
                    item.lastUpdated = new Date().toISOString().split('T')[0];
                    saveData();
                    renderInventoryTable();
                    showNotification('Stok ditambahkan', `Stok ${item.name} telah diperbarui`, 'success');
                }
            }
        });
    });
    
    document.querySelectorAll('.table-btn.delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            const item = inventoryItems.find(i => i.id === itemId);
            if (item && confirm(`Hapus ${item.name} dari daftar stok?`)) {
                const index = inventoryItems.findIndex(i => i.id === itemId);
                inventoryItems.splice(index, 1);
                saveData();
                renderInventoryTable();
                showNotification('Stok dihapus', `${item.name} telah dihapus dari daftar stok`, 'info');
            }
        });
    });
}

// Fungsi untuk menambahkan item stok
function addStockItem() {
    const name = document.getElementById('stock-item').value;
    const quantity = parseInt(document.getElementById('stock-quantity').value);
    const minimum = parseInt(document.getElementById('stock-minimum').value);
    const unit = document.getElementById('stock-unit').value;
    const notes = document.getElementById('stock-notes').value;
    
    if (!name || isNaN(quantity) || isNaN(minimum)) {
        showNotification('Data tidak lengkap', 'Harap isi semua field yang diperlukan', 'error');
        return;
    }
    
    const newId = inventoryItems.length > 0 ? Math.max(...inventoryItems.map(item => item.id)) + 1 : 1;
    inventoryItems.push({
        id: newId,
        name: name,
        currentStock: quantity,
        minimumStock: minimum,
        unit: unit,
        notes: notes || '',
        lastUpdated: new Date().toISOString().split('T')[0]
    });
    
    // Simpan data
    saveData();
    
    // Update tabel
    renderInventoryTable();
    
    // Reset form
    document.getElementById('stock-form').reset();
    
    // Tutup modal
    document.getElementById('stock-modal').classList.remove('active');
    
    showNotification('Stok ditambahkan', `${name} telah ditambahkan ke daftar stok`, 'success');
}

// Fungsi untuk mengecek stok rendah
function checkLowStock() {
    const lowStockItems = inventoryItems.filter(item => item.currentStock <= item.minimumStock);
    
    if (lowStockItems.length === 0) {
        showNotification('Stok aman', 'Semua stok dalam kondisi aman', 'info');
        return;
    }
    
    let message = `Ada ${lowStockItems.length} item dengan stok rendah:\n\n`;
    lowStockItems.forEach(item => {
        message += `• ${item.name}: ${item.currentStock} ${item.unit} (minimum: ${item.minimumStock} ${item.unit})\n`;
    });
    
    alert(message);
}

// Fungsi untuk menambahkan pengeluaran
function addExpense() {
    const description = document.getElementById('expense-description').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value;
    let date = document.getElementById('expense-date').value;
    
    if (!description || isNaN(amount) || amount <= 0) {
        showNotification('Data tidak lengkap', 'Harap isi deskripsi dan jumlah pengeluaran', 'error');
        return;
    }
    
    // Jika tanggal tidak diisi, gunakan tanggal hari ini
    if (!date) {
        const today = new Date();
        date = today.toISOString().split('T')[0];
    }
    
    const newId = expenses.length > 0 ? Math.max(...expenses.map(exp => exp.id)) + 1 : 1;
    expenses.push({
        id: newId,
        description: description,
        amount: amount,
        category: category,
        date: date
    });
    
    // Simpan data
    saveData();
    
    // Update ringkasan
    updateExpenseSummary();
    
    // Reset form
    document.getElementById('expense-description').value = '';
    document.getElementById('expense-amount').value = '';
    
    showNotification('Pengeluaran ditambahkan', 'Data pengeluaran telah disimpan', 'success');
}

// Fungsi untuk mengupdate ringkasan pengeluaran
function updateExpenseSummary() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysPassed = now.getDate();
    
    // Filter pengeluaran bulan ini
    const monthlyExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfMonth;
    });
    
    // Hitung total
    const totalExpense = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Hitung pengeluaran tertinggi
    const highestExpense = monthlyExpenses.length > 0 ? 
        Math.max(...monthlyExpenses.map(exp => exp.amount)) : 0;
    
    // Hitung rata-rata harian
    const dailyAverage = daysPassed > 0 ? totalExpense / daysPassed : 0;
    
    // Update tampilan
    document.getElementById('total-expense').textContent = formatCurrency(totalExpense);
    document.getElementById('highest-expense').textContent = formatCurrency(highestExpense);
    document.getElementById('daily-average-expense').textContent = formatCurrency(dailyAverage);
}

// Fungsi untuk inisialisasi section antrian
function initQueueSection() {
    // Render queue
    renderQueue();
    
    // Refresh queue button
    document.getElementById('refresh-queue').addEventListener('click', renderQueue);
    
    // Clear completed button
    document.getElementById('clear-completed').addEventListener('click', function() {
        if (confirm('Hapus semua order yang sudah selesai?')) {
            // Hanya hapus dari tampilan antrian, tidak dari riwayat
            showNotification('Antrian dibersihkan', 'Order yang selesai telah dihapus dari antrian', 'info');
            renderQueue();
        }
    });
}

// Fungsi untuk merender antrian
function renderQueue() {
    // Filter orders berdasarkan status
    const pendingOrders = ordersHistory.filter(order => order.status === 'pending');
    const preparingOrders = ordersHistory.filter(order => order.status === 'preparing');
    const completedOrders = ordersHistory.filter(order => order.status === 'completed').slice(0, 10); // Ambil 10 terakhir
    
    // Update count
    document.getElementById('pending-count').textContent = pendingOrders.length;
    document.getElementById('preparing-count').textContent = preparingOrders.length;
    document.getElementById('completed-count').textContent = completedOrders.length;
    
    // Render pending orders
    const pendingQueue = document.getElementById('pending-queue');
    if (pendingOrders.length === 0) {
        pendingQueue.innerHTML = `
            <div class="no-data" style="padding: 40px 20px;">
                <i class="fas fa-clock"></i>
                <p>Tidak ada order dalam proses</p>
            </div>
        `;
    } else {
        let html = '';
        pendingOrders.forEach(order => {
            const orderDate = new Date(order.timestamp);
            const timeStr = orderDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            
            html += `
                <div class="queue-item" data-id="${order.id}">
                    <h4>Order #${order.id}</h4>
                    <p>${timeStr} • ${order.items.length} item</p>
                    <div class="queue-item-meta">
                        <span>${order.type === 'delivery' ? 'Delivery' : 'Tempat Makan'}</span>
                        <span>${formatCurrency(order.total)}</span>
                    </div>
                    <div class="queue-item-actions">
                        <button class="btn secondary move-to-preparing" data-id="${order.id}">
                            <i class="fas fa-utensils"></i> Siapkan
                        </button>
                    </div>
                </div>
            `;
        });
        pendingQueue.innerHTML = html;
        
        // Add event listeners
        document.querySelectorAll('.move-to-preparing').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = this.getAttribute('data-id');
                updateOrderStatus(orderId, 'preparing');
            });
        });
    }
    
    // Render preparing orders
    const preparingQueue = document.getElementById('preparing-queue');
    if (preparingOrders.length === 0) {
        preparingQueue.innerHTML = `
            <div class="no-data" style="padding: 40px 20px;">
                <i class="fas fa-utensils"></i>
                <p>Tidak ada order yang sedang disiapkan</p>
            </div>
        `;
    } else {
        let html = '';
        preparingOrders.forEach(order => {
            const orderDate = new Date(order.timestamp);
            const timeStr = orderDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            
            html += `
                <div class="queue-item" data-id="${order.id}">
                    <h4>Order #${order.id}</h4>
                    <p>${timeStr} • ${order.items.length} item</p>
                    <div class="queue-item-meta">
                        <span>${order.type === 'delivery' ? 'Delivery' : 'Tempat Makan'}</span>
                        <span>${formatCurrency(order.total)}</span>
                    </div>
                    <div class="queue-item-actions">
                        <button class="btn success complete-order" data-id="${order.id}">
                            <i class="fas fa-check"></i> Selesai
                        </button>
                    </div>
                </div>
            `;
        });
        preparingQueue.innerHTML = html;
        
        // Add event listeners
        document.querySelectorAll('.complete-order').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = this.getAttribute('data-id');
                updateOrderStatus(orderId, 'completed');
            });
        });
    }
    
    // Render completed orders
    const completedQueue = document.getElementById('completed-queue');
    if (completedOrders.length === 0) {
        completedQueue.innerHTML = `
            <div class="no-data" style="padding: 40px 20px;">
                <i class="fas fa-check-circle"></i>
                <p>Tidak ada order yang selesai</p>
            </div>
        `;
    } else {
        let html = '';
        completedOrders.forEach(order => {
            const orderDate = new Date(order.timestamp);
            const timeStr = orderDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            
            html += `
                <div class="queue-item" data-id="${order.id}">
                    <h4>Order #${order.id}</h4>
                    <p>${timeStr} • ${order.items.length} item</p>
                    <div class="queue-item-meta">
                        <span>${order.type === 'delivery' ? 'Delivery' : 'Tempat Makan'}</span>
                        <span>${formatCurrency(order.total)}</span>
                    </div>
                </div>
            `;
        });
        completedQueue.innerHTML = html;
    }
}

// Fungsi untuk mengupdate status order
function updateOrderStatus(orderId, newStatus) {
    const order = ordersHistory.find(o => o.id === orderId);
    if (!order) return;
    
    order.status = newStatus;
    
    // Simpan data
    saveData();
    
    // Update antrian
    renderQueue();
    
    // Update history jika terbuka
    if (document.getElementById('history').classList.contains('active')) {
        renderHistoryList();
    }
    
    // Tampilkan notifikasi
    const statusText = newStatus === 'preparing' ? 'sedang disiapkan' : 'selesai';
    showNotification('Status diperbarui', `Order #${orderId} telah ${statusText}`, 'success');
}

// Fungsi untuk inisialisasi section pengaturan
function initSettingsSection() {
    // Load settings ke form
    loadSettingsToForm();
    
    // Tab navigation
    const tabs = document.querySelectorAll('.settings-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            const contents = document.querySelectorAll('.settings-tab-content');
            contents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // General settings form
    document.getElementById('general-settings').addEventListener('submit', function(e) {
        e.preventDefault();
        saveGeneralSettings();
    });
    
    // Receipt settings form
    document.getElementById('receipt-settings').addEventListener('submit', function(e) {
        e.preventDefault();
        saveReceiptSettings();
    });
    
    // Reset settings button
    document.getElementById('reset-settings').addEventListener('click', function() {
        if (confirm('Reset semua pengaturan ke default? Data lainnya tidak akan terpengaruh.')) {
            resetSettings();
        }
    });
    
    // Test notification button
    document.getElementById('test-notification').addEventListener('click', function() {
        showNotification('Test Notifikasi', 'Ini adalah notifikasi test dari sistem kasir', 'info');
    });
    
    // Print test receipt button
    document.getElementById('print-test-receipt').addEventListener('click', function() {
        // Buat order test
        const testOrder = {
            id: 'TEST001',
            items: [
                { name: 'Nasi Goreng Spesial', price: 45, quantity: 2 },
                { name: 'Es Teh Manis', price: 10, quantity: 2 }
            ],
            subtotal: 110,
            deliveryFee: 0,
            total: 110,
            type: 'dine-in',
            timestamp: new Date().toISOString(),
            cashier: settings.cashierName
        };
        
        showReceiptModal(testOrder);
    });
    
    // Backup data button
    document.getElementById('backup-data').addEventListener('click', backupData);
    
    // Restore data button
    document.getElementById('restore-data').addEventListener('click', restoreData);
    
    // Clear all data button
    document.getElementById('clear-all-data').addEventListener('click', function() {
        if (confirm('HAPUS SEMUA DATA? Tindakan ini tidak dapat dibatalkan. Semua data akan dihapus permanen.')) {
            clearAllData();
        }
    });
}

// Fungsi untuk memuat pengaturan ke form
function loadSettingsToForm() {
    // General settings
    document.getElementById('cashier-name').value = settings.cashierName;
    document.getElementById('currency').value = settings.currency;
    document.getElementById('language').value = settings.language;
    document.getElementById('whatsapp-number').value = settings.whatsappNumber;
    document.getElementById('telegram-number').value = settings.telegramNumber;
    document.getElementById('business-name').value = settings.businessName;
    document.getElementById('business-address').value = settings.businessAddress;
    document.getElementById('business-phone').value = settings.businessPhone;
    
    // Receipt settings
    document.getElementById('receipt-header').value = settings.receiptHeader;
    document.getElementById('receipt-footer').value = settings.receiptFooter;
    document.getElementById('receipt-logo').value = settings.receiptLogo;
    document.getElementById('show-tax').checked = settings.showTax;
    document.getElementById('show-qr').checked = settings.showQr;
    document.getElementById('tax-rate').value = settings.taxRate;
    document.getElementById('receipt-width').value = settings.receiptWidth;
    
    // Notification settings
    document.getElementById('notify-new-order').checked = settings.notifyNewOrder;
    document.getElementById('notify-low-stock').checked = settings.notifyLowStock;
    document.getElementById('notify-daily-report').checked = settings.notifyDailyReport;
    document.getElementById('notify-monthly-report').checked = settings.notifyMonthlyReport;
    
    // Backup settings
    document.getElementById('auto-backup').checked = settings.autoBackup;
    document.getElementById('backup-frequency').value = settings.backupFrequency;
}

// Fungsi untuk menyimpan pengaturan umum
function saveGeneralSettings() {
    settings.cashierName = document.getElementById('cashier-name').value;
    settings.currency = document.getElementById('currency').value;
    settings.language = document.getElementById('language').value;
    settings.whatsappNumber = document.getElementById('whatsapp-number').value;
    settings.telegramNumber = document.getElementById('telegram-number').value;
    settings.businessName = document.getElementById('business-name').value;
    settings.businessAddress = document.getElementById('business-address').value;
    settings.businessPhone = document.getElementById('business-phone').value;
    
    // Simpan data
    saveData();
    
    // Update UI
    updateUIWithSettings();
    
    showNotification('Pengaturan disimpan', 'Pengaturan umum telah diperbarui', 'success');
}

// Fungsi untuk menyimpan pengaturan struk
function saveReceiptSettings() {
    settings.receiptHeader = document.getElementById('receipt-header').value;
    settings.receiptFooter = document.getElementById('receipt-footer').value;
    settings.receiptLogo = document.getElementById('receipt-logo').value;
    settings.showTax = document.getElementById('show-tax').checked;
    settings.showQr = document.getElementById('show-qr').checked;
    settings.taxRate = parseFloat(document.getElementById('tax-rate').value);
    settings.receiptWidth = parseInt(document.getElementById('receipt-width').value);
    
    // Simpan data
    saveData();
    
    showNotification('Pengaturan disimpan', 'Pengaturan struk telah diperbarui', 'success');
}

// Fungsi untuk mereset pengaturan
function resetSettings() {
    settings = { ...DEFAULT_SETTINGS };
    
    // Simpan data
    saveData();
    
    // Reload form
    loadSettingsToForm();
    
    // Update UI
    updateUIWithSettings();
    
    showNotification('Pengaturan direset', 'Semua pengaturan telah dikembalikan ke default', 'info');
}

// Fungsi untuk backup data
function backupData() {
    const backup = {
        settings: settings,
        menu: menuItems,
        orders: ordersHistory,
        inventory: inventoryItems,
        expenses: expenses,
        timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(backup, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `kasir_backup_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Backup berhasil', 'Data telah diunduh sebagai file JSON', 'success');
}

// Fungsi untuk restore data
function restoreData() {
    const fileInput = document.getElementById('restore-file');
    
    if (!fileInput.files.length) {
        showNotification('File tidak dipilih', 'Pilih file backup terlebih dahulu', 'warning');
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const backup = JSON.parse(e.target.result);
            
            if (confirm('Restore data dari backup? Data saat ini akan diganti.')) {
                // Restore data
                if (backup.settings) settings = backup.settings;
                if (backup.menu) menuItems = backup.menu;
                if (backup.orders) ordersHistory = backup.orders;
                if (backup.inventory) inventoryItems = backup.inventory;
                if (backup.expenses) expenses = backup.expenses;
                
                // Simpan data
                saveData();
                
                // Update UI
                updateUIWithSettings();
                loadSettingsToForm();
                
                // Reset file input
                fileInput.value = '';
                
                showNotification('Restore berhasil', 'Data telah dipulihkan dari backup', 'success');
            }
        } catch (error) {
            showNotification('Restore gagal', 'File backup tidak valid', 'error');
        }
    };
    
    reader.readAsText(file);
}

// Fungsi untuk menghapus semua data
function clearAllData() {
    // Reset semua data ke default
    menuItems = [...DEFAULT_MENU];
    ordersHistory = [];
    inventoryItems = [...DEFAULT_INVENTORY];
    expenses = [...DEFAULT_EXPENSES];
    
    // Simpan data
    saveData();
    
    // Update UI
    renderMenuTable();
    renderHistoryList();
    renderInventoryTable();
    updateExpenseSummary();
    
    // Jika di section dashboard, update data
    if (document.getElementById('dashboard').classList.contains('active')) {
        updateDashboardData();
    }
    
    showNotification('Data dihapus', 'Semua data telah direset ke default', 'info');
}

// Fungsi untuk inisialisasi modal
function initModals() {
    // Close modal buttons
    document.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
        });
    });
    
    // Close modal ketika klik di luar konten
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
    
    // Reprint receipt button in order modal
    document.getElementById('reprint-receipt').addEventListener('click', function() {
        const orderId = this.getAttribute('data-order-id');
        const order = ordersHistory.find(o => o.id === orderId);
        if (order) {
            showReceiptModal(order);
        }
    });
    
    // Print receipt button in receipt modal
    document.getElementById('print-receipt-btn').addEventListener('click', function() {
        printReceipt();
    });
}

// Fungsi untuk menampilkan modal struk
function showReceiptModal(order = null) {
    // Jika tidak ada order yang diberikan, gunakan order saat ini
    if (!order && currentOrder.length > 0) {
        // Buat order dari currentOrder
        const subtotal = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const isDelivery = document.querySelector('input[name="order-type"]:checked').value === 'delivery';
        const deliveryFee = isDelivery ? 20 : 0;
        const total = subtotal + deliveryFee;
        
        order = {
            id: generateOrderId(),
            items: [...currentOrder],
            subtotal: subtotal,
            deliveryFee: deliveryFee,
            total: total,
            type: document.querySelector('input[name="order-type"]:checked').value,
            timestamp: new Date().toISOString(),
            cashier: settings.cashierName
        };
    }
    
    if (!order) {
        showNotification('Tidak ada order', 'Tidak ada order untuk dicetak', 'warning');
        return;
    }
    
    // Render receipt
    renderReceipt(order);
    
    // Tampilkan modal
    document.getElementById('receipt-modal').classList.add('active');
}

// Fungsi untuk merender struk
function renderReceipt(order) {
    const receiptContent = document.getElementById('receipt-content');
    
    const orderDate = new Date(order.timestamp);
    const dateStr = orderDate.toLocaleDateString('id-ID');
    const timeStr = orderDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    
    // Hitung pajak jika diaktifkan
    const tax = settings.showTax ? order.subtotal * (settings.taxRate / 100) : 0;
    const totalWithTax = order.total + tax;
    
    // Buat items HTML
    let itemsHtml = '';
    order.items.forEach(item => {
        itemsHtml += `
            <div class="receipt-item">
                <span>${item.name} x${item.quantity}</span>
                <span>${formatCurrency(item.price * item.quantity)}</span>
            </div>
        `;
    });
    
    receiptContent.innerHTML = `
        <div class="receipt" style="max-width: ${settings.receiptWidth}mm; margin: 0 auto; font-family: 'Courier New', monospace; font-size: 14px;">
            <div class="receipt-header" style="text-align: center; margin-bottom: 15px; border-bottom: 1px dashed #000; padding-bottom: 10px;">
                ${settings.receiptLogo ? `<img src="${settings.receiptLogo}" alt="Logo" style="max-width: 60px; margin-bottom: 10px;">` : ''}
                <h2 style="margin: 0 0 5px 0; font-size: 18px;">${settings.businessName}</h2>
                <p style="margin: 0 0 5px 0; font-size: 12px;">${settings.businessAddress}</p>
                <p style="margin: 0; font-size: 12px;">Tel: ${settings.businessPhone || '-'}</p>
            </div>
            
            <div style="text-align: center; margin-bottom: 15px;">
                <p style="margin: 0 0 5px 0;"><strong>STRUK PEMBAYARAN</strong></p>
                <p style="margin: 0; font-size: 12px;">${dateStr} ${timeStr}</p>
                <p style="margin: 0; font-size: 12px;">Order: #${order.id}</p>
                <p style="margin: 0; font-size: 12px;">Kasir: ${order.cashier}</p>
            </div>
            
            <div class="receipt-items" style="margin-bottom: 15px; border-bottom: 1px dashed #000; padding-bottom: 10px;">
                ${itemsHtml}
            </div>
            
            <div class="receipt-summary" style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>Subtotal:</span>
                    <span>${formatCurrency(order.subtotal)}</span>
                </div>
                
                ${order.deliveryFee > 0 ? `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span>Biaya Delivery:</span>
                        <span>${formatCurrency(order.deliveryFee)}</span>
                    </div>
                ` : ''}
                
                ${settings.showTax ? `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span>Pajak (${settings.taxRate}%):</span>
                        <span>${formatCurrency(tax)}</span>
                    </div>
                ` : ''}
                
                <div style="display: flex; justify-content: space-between; font-weight: bold; border-top: 1px dashed #000; padding-top: 10px; margin-top: 10px;">
                    <span>TOTAL:</span>
                    <span>${formatCurrency(settings.showTax ? totalWithTax : order.total)}</span>
                </div>
            </div>
            
            <div class="receipt-footer" style="text-align: center; font-size: 12px; border-top: 1px dashed #000; padding-top: 10px;">
                <p style="margin: 0 0 10px 0;">${settings.receiptHeader}</p>
                ${settings.showQr ? `
                    <div style="margin: 10px 0;">
                        <!-- Placeholder untuk QR code -->
                        <div style="width: 80px; height: 80px; background: #f0f0f0; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                            <span>QR Code</span>
                        </div>
                    </div>
                ` : ''}
                <p style="margin: 10px 0 0 0;">${settings.receiptFooter}</p>
            </div>
        </div>
    `;
}

// Fungsi untuk mencetak struk
function printReceipt() {
    const receiptContent = document.getElementById('receipt-content').innerHTML;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Struk Pembayaran</title>
                <style>
                    body { 
                        font-family: 'Courier New', monospace; 
                        margin: 0;
                        padding: 10px;
                    }
                    @media print {
                        @page { margin: 0; }
                        body { margin: 0.5cm; }
                    }
                </style>
            </head>
            <body>
                ${receiptContent}
                <script>
                    window.onload = function() {
                        window.print();
                        window.onafterprint = function() {
                            window.close();
                        };
                    };
                </script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

// Fungsi untuk inisialisasi notifikasi
function initNotifications() {
    // Notifikasi button di header
    document.querySelector('.notif-btn').addEventListener('click', function() {
        showNotification('Notifikasi', 'Fitur notifikasi sedang dikembangkan', 'info');
    });
    
    // Help button
    document.getElementById('help-btn').addEventListener('click', function() {
        showNotification('Bantuan', 'Untuk bantuan, hubungi admin sistem', 'info');
    });
}

// Fungsi untuk menampilkan notifikasi
function showNotification(title, message, type = 'info') {
    const container = document.getElementById('notification-container');
    
    // Buat elemen notifikasi
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Tentukan ikon berdasarkan tipe
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    else if (type === 'error') icon = 'exclamation-circle';
    else if (type === 'warning') icon = 'exclamation-triangle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <div class="notification-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
    `;
    
    // Tambahkan ke container
    container.appendChild(notification);
    
    // Hapus notifikasi setelah 5 detik
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            container.removeChild(notification);
        }, 300);
    }, 5000);
    
    // Update notif count di header
    const notifCount = document.querySelector('.notif-count');
    const currentCount = parseInt(notifCount.textContent) || 0;
    notifCount.textContent = currentCount + 1;
    
    // Reset count setelah 5 detik
    setTimeout(() => {
        const newCount = parseInt(notifCount.textContent) - 1;
        notifCount.textContent = newCount > 0 ? newCount : 0;
    }, 5000);
}

// Fungsi untuk memformat mata uang
function formatCurrency(amount) {
    const formatter = new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
    
    return `${settings.currency}${formatter.format(amount)}`;
}

// Event listener untuk mencegah form submission pada enter
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'BUTTON') {
        e.preventDefault();
    }
});