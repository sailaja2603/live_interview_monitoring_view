/*=========================================================
            AI LIVE INTERVIEW MONITORING DASHBOARD
                    app.js
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {
    initializeDashboard();
});

/*=========================================================
                    Initialize Dashboard
=========================================================*/
function initializeDashboard() {
    sidebarNavigation();
    setupTabNavigation();
    setupThemeToggle();
    buttonEffects();
    cardHoverEffects();
    animateCounters();
    animateProgressBars();
    showWelcomeNotification();
    setupSchedulerForm();
    setupCandidateDirectory();
}

/*=========================================================
                    Sidebar Navigation & Tabs
=========================================================*/
function sidebarNavigation() {
    const menuItems = document.querySelectorAll(".menu li");

    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            menuItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            
            // Tab switching is handled in setupTabNavigation
        });
    });
}

function setupTabNavigation() {
    const menuItems = document.querySelectorAll(".menu li[data-tab]");
    const tabPanes = document.querySelectorAll(".tab-pane");

    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            const tabName = item.getAttribute("data-tab");
            if (!tabName) return;

            if (tabName === "logout") {
                createToast("Session Logged Out Successfully", "danger");
                setTimeout(() => location.reload(), 1500);
                return;
            }

            // Hide all tab panes
            tabPanes.forEach(pane => {
                pane.classList.remove("active-tab");
            });

            // Show current tab pane
            const targetPane = document.getElementById(`${tabName}-tab`);
            if (targetPane) {
                targetPane.classList.add("active-tab");
                
                // Trigger chart updates or animations depending on tab
                if (tabName === "live-monitoring") {
                    if (typeof resumeCodeStream === "function") resumeCodeStream();
                } else {
                    if (typeof pauseCodeStream === "function") pauseCodeStream();
                }
                
                // Trigger counters and progress bars again on tab switch
                animateProgressBars();
            }
        });
    });
}

/*=========================================================
                    Theme Mode Toggle
=========================================================*/
function setupThemeToggle() {
    const toggleBtn = document.getElementById("themeToggle");
    if (!toggleBtn) return;

    // Load saved preference
    const savedTheme = localStorage.getItem("dashboardTheme") || "light";
    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
        toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    toggleBtn.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark-theme");
        if (isDark) {
            localStorage.setItem("dashboardTheme", "dark");
            toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            createToast("Sleek Dark Mode enabled.", "success");
        } else {
            localStorage.setItem("dashboardTheme", "light");
            toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            createToast("Classic Light Mode enabled.", "success");
        }
    });
}

/*=========================================================
                    Button Ripple Effect
=========================================================*/
function buttonEffects() {
    const buttons = document.querySelectorAll(".btn");

    buttons.forEach(button => {
        button.addEventListener("mouseenter", () => {
            button.style.transform = "translateY(-3px) scale(1.02)";
        });

        button.addEventListener("mouseleave", () => {
            button.style.transform = "translateY(0) scale(1)";
        });
    });
}

/*=========================================================
                    Card Hover
=========================================================*/
function cardHoverEffects() {
    const cards = document.querySelectorAll(
        ".candidate-card,.resume-card,.skills-card,.question-card,.progress-card,.analytics-card,.status-card,.metric-card,.summary-box,.proctor-sim-card,.scheduler-card"
    );

    cards.forEach(card => {
        card.addEventListener("mouseenter", () => {
            card.style.transition = ".35s";
            card.style.transform = "translateY(-8px)";
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "translateY(0px)";
        });
    });
}

/*=========================================================
                Progress Animation
=========================================================*/
function animateProgressBars() {
    const bars = document.querySelectorAll(".progress-bar");

    bars.forEach(bar => {
        const value = bar.style.width || "0%";
        bar.style.width = "0%";

        setTimeout(() => {
            bar.style.transition = "width 1.2s cubic-bezier(0.1, 0.8, 0.25, 1)";
            bar.style.width = value;
        }, 300);
    });
}

/*=========================================================
                Animated Counters
=========================================================*/
function animateCounters() {
    const counters = document.querySelectorAll(".metric-card h2, .summary-box h2");

    counters.forEach(counter => {
        // Skip elements with non-numeric text
        let rawText = counter.innerText.replace("%", "").trim();
        let target = parseInt(rawText);

        if (isNaN(target)) return;

        let count = 0;
        const increment = Math.ceil(target / 45);
        const hasPercent = counter.innerText.includes("%");

        const interval = setInterval(() => {
            count += increment;

            if (count >= target) {
                count = target;
                clearInterval(interval);
            }

            counter.innerText = count + (hasPercent ? "%" : "");
        }, 25);
    });
}

/*=========================================================
                Welcome Notification
=========================================================*/
function showWelcomeNotification() {
    setTimeout(() => {
        createToast("AI Proctoring System Loaded Successfully", "success");
    }, 1200);
}

/*=========================================================
                Toast Notification
=========================================================*/
function createToast(message, type = "success") {
    // Clean old toast if duplicate
    const existing = document.querySelector(".custom-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "custom-toast";

    let color = "#22c55e"; // Success
    let icon = '<i class="fa-solid fa-circle-check"></i>';
    
    if (type === "danger") {
        color = "#ef4444";
        icon = '<i class="fa-solid fa-circle-xmark"></i>';
    }
    if (type === "warning") {
        color = "#f59e0b";
        icon = '<i class="fa-solid fa-triangle-exclamation"></i>';
    }
    if (type === "info") {
        color = "#2563eb";
        icon = '<i class="fa-solid fa-circle-info"></i>';
    }

    toast.style.cssText = `
        position: fixed;
        top: 25px;
        right: 25px;
        background: ${color};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 15px 35px rgba(0,0,0,.2);
        z-index: 9999;
        opacity: 0;
        display: flex;
        align-items: center;
        gap: 12px;
        transition: all .35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;

    toast.innerHTML = `${icon} <span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(10px)";
    }, 50);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(-10px)";
        setTimeout(() => toast.remove(), 400);
    }, 4500);
}

/*=========================================================
                Interviews Scheduler Logic
=========================================================*/
function setupSchedulerForm() {
    const form = document.getElementById("interviewSchedulerForm");
    const upcomingList = document.getElementById("upcomingInterviewsList");
    if (!form || !upcomingList) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("schedName").value;
        const email = document.getElementById("schedEmail").value;
        const time = document.getElementById("schedTime").value;
        const role = document.getElementById("schedRole").value;

        if (!name || !email || !time) {
            createToast("Please fill in all details.", "warning");
            return;
        }

        // Add to schedule list
        const dateObj = new Date(time);
        const formattedDate = dateObj.toLocaleDateString() + " at " + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const item = document.createElement("div");
        item.className = "upcoming-item";
        item.innerHTML = `
            <div class="upcoming-details">
                <h5>${name}</h5>
                <p><i class="fa-solid fa-briefcase"></i> ${role} | <i class="fa-regular fa-clock"></i> ${formattedDate}</p>
                <p><i class="fa-regular fa-envelope"></i> ${email}</p>
            </div>
            <div>
                <span class="badge bg-primary">Scheduled</span>
                <button class="btn btn-outline-danger btn-sm ms-2" onclick="this.closest('.upcoming-item').remove();">Cancel</button>
            </div>
        `;

        upcomingList.prepend(item);
        form.reset();
        createToast(`Interview scheduled for ${name}!`, "success");
    });
}

/*=========================================================
                Candidates Directory Logic
=========================================================*/
function setupCandidateDirectory() {
    const searchInput = document.getElementById("candidateSearch");
    const filterSelect = document.getElementById("candidateFilter");
    const tableBody = document.getElementById("candidatesTableBody");
    if (!tableBody) return;

    // Search filter trigger
    if (searchInput) {
        searchInput.addEventListener("input", filterCandidates);
    }
    if (filterSelect) {
        filterSelect.addEventListener("change", filterCandidates);
    }

    function filterCandidates() {
        const query = searchInput ? searchInput.value.toLowerCase() : "";
        const filterVal = filterSelect ? filterSelect.value : "all";
        const rows = tableBody.querySelectorAll("tr");

        rows.forEach(row => {
            const name = row.querySelector(".avatar-info h6").innerText.toLowerCase();
            const role = row.querySelector(".avatar-info + td").innerText.toLowerCase();
            const status = row.querySelector("td .badge").innerText.toLowerCase();
            
            const matchesSearch = name.includes(query) || role.includes(query);
            const matchesFilter = filterVal === "all" || status.includes(filterVal.toLowerCase());

            if (matchesSearch && matchesFilter) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }
}

// Make accessible
window.createToast = createToast;