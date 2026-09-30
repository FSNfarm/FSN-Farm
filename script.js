"use strict";

/* =========================================================
   FSN FARM MANAGEMENT SYSTEM
   script.js
   ========================================================= */


/* =========================================================
   CONFIGURATION
   ========================================================= */

const CONFIG = {
    FEED_CAPACITY: 5000,
    HARVEST_WEIGHT: 1.8,

    // Login sementara.
    // Nanti dapat diganti dengan Supabase Authentication.
    LOGIN_EMAIL: "admin@fsnfarm.com",
    LOGIN_PASSWORD: "admin123"
};


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("FSN Farm System Loaded");

    initLogin();
    initLogout();

    initSidebar();

    updateCurrentDate();

    initFarmForm();

    loadFarmData();

    initMenu();

});


/* =========================================================
   HELPER
   ========================================================= */

function getElement(id) {

    return document.getElementById(id);

}


function getNumber(id) {

    const element = getElement(id);

    if (!element) {
        return 0;
    }

    const value = parseFloat(element.value);

    return Number.isFinite(value) ? value : 0;

}


function formatNumber(value, maximumFractionDigits = 2) {

    return Number(value || 0).toLocaleString("id-ID", {
        maximumFractionDigits
    });

}


/* =========================================================
   LOGIN SYSTEM
   ========================================================= */

function initLogin() {

    const loginPage = getElement("loginPage");
    const farmApp = getElement("farmApp");

    const loginForm = getElement("loginForm");
    const loginError = getElement("loginError");

    if (!loginPage || !farmApp) {
        console.error("Login page atau farmApp tidak ditemukan.");
        return;
    }


    /* -----------------------------------------
       CHECK LOGIN SESSION
       ----------------------------------------- */

    const loggedIn =
        sessionStorage.getItem("fsnFarmLoggedIn") === "true";


    if (loggedIn) {

        showDashboard();

    } else {

        showLogin();

    }


    /* -----------------------------------------
       LOGIN SUBMIT
       ----------------------------------------- */

    if (!loginForm) {

        console.error("loginForm tidak ditemukan.");

        return;

    }


    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const email =
            getElement("loginEmail")?.value.trim() || "";

        const password =
            getElement("loginPassword")?.value || "";


        if (
            email === CONFIG.LOGIN_EMAIL &&
            password === CONFIG.LOGIN_PASSWORD
        ) {

            sessionStorage.setItem(
                "fsnFarmLoggedIn",
                "true"
            );


            if (loginError) {

                loginError.style.display = "none";

            }


            showDashboard();


        } else {

            if (loginError) {

                loginError.textContent =
                    "Email / username atau password salah.";

                loginError.style.display = "block";

            }

        }

    });

}


/* =========================================================
   SHOW LOGIN
   ========================================================= */

function showLogin() {

    const loginPage = getElement("loginPage");
    const farmApp = getElement("farmApp");


    if (loginPage) {

        loginPage.style.display = "flex";

    }


    if (farmApp) {

        farmApp.style.display = "none";

    }

}


/* =========================================================
   SHOW DASHBOARD
   ========================================================= */

function showDashboard() {

    const loginPage = getElement("loginPage");
    const farmApp = getElement("farmApp");


    if (loginPage) {

        loginPage.style.display = "none";

    }


    if (farmApp) {

        farmApp.style.display = "flex";

    }


    updateDashboard();

}


/* =========================================================
   LOGOUT
   ========================================================= */

function initLogout() {

    const logoutButton =
        getElement("logoutButton");


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        function () {

            sessionStorage.removeItem(
                "fsnFarmLoggedIn"
            );


            showLogin();


            const password =
                getElement("loginPassword");

            if (password) {

                password.value = "";

            }

        }
    );

}


/* =========================================================
   CURRENT DATE
   ========================================================= */

function updateCurrentDate() {

    const currentDate =
        getElement("currentDate");


    if (!currentDate) {
        return;
    }


    const today = new Date();


    currentDate.textContent =
        today.toLocaleDateString(
            "id-ID",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

}


/* =========================================================
   SIDEBAR
   ========================================================= */

function initSidebar() {

    const sidebar =
        getElement("sidebar");

    const menuToggle =
        getElement("menuToggle");

    const overlay =
        getElement("sidebarOverlay");


    if (!sidebar) {
        return;
    }


    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            function () {

                sidebar.classList.toggle(
                    "sidebar-open"
                );


                if (overlay) {

                    overlay.classList.toggle(
                        "active"
                    );

                }

            }
        );

    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeSidebar
        );

    }

}


/* =========================================================
   CLOSE SIDEBAR
   ========================================================= */

function closeSidebar() {

    const sidebar =
        getElement("sidebar");

    const overlay =
        getElement("sidebarOverlay");


    if (sidebar) {

        sidebar.classList.remove(
            "sidebar-open"
        );

    }


    if (overlay) {

        overlay.classList.remove(
            "active"
        );

    }

}


/* =========================================================
   SIDEBAR MENU
   ========================================================= */

function initMenu() {

    const menuItems =
        document.querySelectorAll(
            ".menu-item"
        );


    menuItems.forEach(
        function (item) {

            item.addEventListener(
                "click",
                function () {

                    menuItems.forEach(
                        function (menu) {

                            menu.classList.remove(
                                "active"
                            );

                        }
                    );


                    item.classList.add(
                        "active"
                    );


                    const menuName =
                        item.dataset.menu;


                    handleMenu(menuName);


                    if (
                        window.innerWidth <= 900
                    ) {

                        closeSidebar();

                    }

                }
            );

        }
    );

}


/* =========================================================
   MENU ACTION
   ========================================================= */

function handleMenu(menuName) {

    switch (menuName) {

case "dashboard":

    showPage("dashboardPage");

    break;


        case "population":

            scrollToInput(
                "initialChicken"
            );

            break;


        case "feed":

            scrollToInput(
                "initialFeed"
            );

            break;


        case "mortality":

            scrollToInput(
                "dailyDeath"
            );

            break;


        case "growth":

            scrollToInput(
                "averageWeight"
            );

            break;


        case "health":

            showTemporaryMessage(
                "Menu Kesehatan akan dikembangkan."
            );

            break;


case "harvest":

    showPage("harvestPage");

    break;

        case "finance":

            showTemporaryMessage(
                "Menu Keuangan akan dikembangkan."
            );

            break;


        case "report":

            document
                .querySelector(".recent-panel")
                ?.scrollIntoView({
                    behavior: "smooth"
                });

            break;


        case "settings":

            showTemporaryMessage(
                "Menu Pengaturan akan dikembangkan."
            );

            break;

    }

}

/* =========================================================
   PAGE NAVIGATION
========================================================= */

function showPage(pageId) {

    const pages = document.querySelectorAll(".page-section");

    pages.forEach(function (page) {
        page.classList.remove("active");
        page.classList.remove("active-page");
    });

    const targetPage = document.getElementById(pageId);

    if (targetPage) {
        targetPage.classList.add("active");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

}
/* =========================================================
   SCROLL HELPERS
   ========================================================= */

function scrollDashboardTop() {

    document
        .querySelector(".dashboard-content")
        ?.scrollIntoView({
            behavior: "smooth"
        });

}


function scrollToInput(id) {

    const element =
        getElement(id);


    if (!element) {
        return;
    }


    element.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });


    setTimeout(
        () => element.focus(),
        400
    );

}


/* =========================================================
   FARM DATA FORM
   ========================================================= */

function initFarmForm() {

    const form =
        getElement("farmDataForm");


    if (!form) {

        console.error(
            "farmDataForm tidak ditemukan."
        );

        return;

    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            saveFarmData();

        }
    );

}


/* =========================================================
   SAVE FARM DATA
   ========================================================= */

function saveFarmData() {

    hideMessages();


    const initialChicken =
        Math.max(
            0,
            Math.floor(
                getNumber("initialChicken")
            )
        );


    const dailyDeath =
        Math.max(
            0,
            Math.floor(
                getNumber("dailyDeath")
            )
        );


    const initialFeed =
        Math.max(
            0,
            getNumber("initialFeed")
        );


    const feedIncoming =
        Math.max(
            0,
            getNumber("feedIncoming")
        );


    const feedUsed =
        Math.max(
            0,
            getNumber("feedUsed")
        );


    const averageWeight =
        Math.max(
            0,
            getNumber("averageWeight")
        );


    /* -----------------------------------------
       VALIDATION
       ----------------------------------------- */

    if (initialChicken <= 0) {

        showSaveError(
            "Masukkan populasi awal ayam."
        );

        return;

    }


    if (dailyDeath > initialChicken) {

        showSaveError(
            "Jumlah ayam mati tidak boleh melebihi populasi awal."
        );

        return;

    }


    const calculatedFeed =
        initialFeed +
        feedIncoming -
        feedUsed;


    if (calculatedFeed < 0) {

        showSaveError(
            "Pakan digunakan melebihi stok pakan yang tersedia."
        );

        return;

    }


    const liveChicken =
        Math.max(
            0,
            initialChicken - dailyDeath
        );


    const mortality =
        initialChicken > 0
            ? (
                dailyDeath /
                initialChicken
              ) * 100
            : 0;


    const harvestChicken =
        averageWeight >=
        CONFIG.HARVEST_WEIGHT

            ? liveChicken

            : 0;


    /* -----------------------------------------
       DATA OBJECT
       ----------------------------------------- */

    const farmData = {

        id: Date.now(),

        timestamp:
            new Date().toISOString(),

        date:
            new Date().toLocaleDateString(
                "id-ID"
            ),

        initialChicken,

        dailyDeath,

        liveChicken,

        initialFeed,

        feedIncoming,

        feedUsed,

        feedStock:
            calculatedFeed,

        averageWeight,

        mortality,

        harvestChicken

    };


    /* -----------------------------------------
       SAVE CURRENT DATA
       ----------------------------------------- */

    localStorage.setItem(
        "fsnFarmCurrentData",
        JSON.stringify(farmData)
    );


    /* -----------------------------------------
       SAVE HISTORY
       ----------------------------------------- */

    const history =
        getFarmHistory();


    history.unshift(
        farmData
    );


    const limitedHistory =
        history.slice(
            0,
            30
        );


    localStorage.setItem(
        "fsnFarmHistory",
        JSON.stringify(limitedHistory)
    );


    /* -----------------------------------------
       UPDATE DASHBOARD
       ----------------------------------------- */

    updateDashboard(
        farmData
    );


    renderHistory();


    showSuccess();


    console.log(
        "Farm data saved:",
        farmData
    );

}


/* =========================================================
   LOAD FARM DATA
   ========================================================= */

function loadFarmData() {

    const raw =
        localStorage.getItem(
            "fsnFarmCurrentData"
        );


    if (!raw) {

        updateDashboard();

        renderHistory();

        return;

    }


    try {

        const data =
            JSON.parse(raw);


        updateDashboard(
            data
        );


    } catch (error) {

        console.error(
            "Gagal membaca data farm:",
            error
        );

    }


    renderHistory();

}


/* =========================================================
   UPDATE DASHBOARD
   ========================================================= */

function updateDashboard(data = null) {

    if (!data) {

        const raw =
            localStorage.getItem(
                "fsnFarmCurrentData"
            );


        if (raw) {

            try {

                data =
                    JSON.parse(raw);

            } catch (error) {

                data = null;

            }

        }

    }


    if (!data) {

        data = {

            liveChicken: 0,
            dailyDeath: 0,
            feedStock: 0,
            averageWeight: 0,
            mortality: 0,
            harvestChicken: 0

        };

    }


    /* -----------------------------------------
       MAIN CARDS
       ----------------------------------------- */

    setText(
        "liveChicken",
        formatNumber(
            data.liveChicken,
            0
        )
    );


    setText(
        "feedStock",
        `${formatNumber(
            data.feedStock
        )} kg`
    );


    setText(
        "deadChicken",
        formatNumber(
            data.dailyDeath,
            0
        )
    );


    setText(
        "harvestChicken",
        formatNumber(
            data.harvestChicken,
            0
        )
    );


    /* -----------------------------------------
       FEED PANEL
       ----------------------------------------- */

    setText(
        "feedPanelValue",
        formatNumber(
            data.feedStock
        )
    );


    updateFeedProgress(
        data.feedStock
    );


    /* -----------------------------------------
       PERFORMANCE
       ----------------------------------------- */

    setText(
        "mortalityRate",
        `${Number(
            data.mortality || 0
        ).toFixed(2)}%`
    );


    setText(
        "weightValue",
        `${Number(
            data.averageWeight || 0
        ).toFixed(2)} kg`
    );


    updateFCR(data);

}


/* =========================================================
   SET TEXT
   ========================================================= */

function setText(id, value) {

    const element =
        getElement(id);


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================================
   FEED PROGRESS
   ========================================================= */

function updateFeedProgress(feedStock) {

    const bar =
        getElement(
            "feedProgressBar"
        );


    const status =
        getElement(
            "feedStatus"
        );


    const feed =
        Math.max(
            0,
            Number(feedStock || 0)
        );


    const percentage =
        Math.min(
            100,
            (
                feed /
                CONFIG.FEED_CAPACITY
            ) * 100
        );


    if (bar) {

        bar.style.width =
            `${percentage}%`;

    }


    if (!status) {
        return;
    }


    if (percentage <= 20) {

        status.textContent =
            "Kritis";

        status.dataset.status =
            "danger";


    } else if (
        percentage <= 40
    ) {

        status.textContent =
            "Menipis";

        status.dataset.status =
            "warning";


    } else {

        status.textContent =
            "Aman";

        status.dataset.status =
            "safe";

    }

}


/* =========================================================
   FCR
   ========================================================= */

function updateFCR(data) {

    const fcrElement =
        getElement("fcrValue");


    if (!fcrElement) {
        return;
    }


    const feedUsed =
        Number(
            data.feedUsed || 0
        );


    const liveChicken =
        Number(
            data.liveChicken || 0
        );


    const weight =
        Number(
            data.averageWeight || 0
        );


    const biomass =
        liveChicken * weight;


    if (
        feedUsed > 0 &&
        biomass > 0
    ) {

        const fcr =
            feedUsed / biomass;


        fcrElement.textContent =
            fcr.toFixed(2);


    } else {

        fcrElement.textContent =
            "--";

    }

}


/* =========================================================
   HISTORY
   ========================================================= */

function getFarmHistory() {

    const raw =
        localStorage.getItem(
            "fsnFarmHistory"
        );


    if (!raw) {

        return [];

    }


    try {

        const history =
            JSON.parse(raw);


        return Array.isArray(history)
            ? history
            : [];


    } catch (error) {

        return [];

    }

}


/* =========================================================
   RENDER HISTORY
   ========================================================= */

function renderHistory() {

    const tbody =
        getElement(
            "historyTableBody"
        );


    if (!tbody) {
        return;
    }


    const history =
        getFarmHistory();


    tbody.innerHTML = "";


    if (history.length === 0) {

        tbody.innerHTML = `
            <tr class="empty-row">
                <td colspan="6">
                    Belum ada data peternakan.
                </td>
            </tr>
        `;

        return;

    }


    history.forEach(
        function (data) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${escapeHTML(
                        data.date
                    )}
                </td>

                <td>
                    ${formatNumber(
                        data.liveChicken,
                        0
                    )}
                </td>

                <td>
                    ${formatNumber(
                        data.dailyDeath,
                        0
                    )}
                </td>

                <td>
                    ${formatNumber(
                        data.feedStock
                    )} kg
                </td>

                <td>
                    ${Number(
                        data.averageWeight || 0
                    ).toFixed(2)} kg
                </td>

                <td>
                    ${Number(
                        data.mortality || 0
                    ).toFixed(2)}%
                </td>

            `;


            tbody.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(value ?? "");


    return div.innerHTML;

}


/* =========================================================
   SUCCESS MESSAGE
   ========================================================= */

function showSuccess() {

    const success =
        getElement(
            "successMessage"
        );


    if (!success) {
        return;
    }


    success.style.display =
        "block";


    setTimeout(
        function () {

            success.style.display =
                "none";

        },
        3500
    );

}


/* =========================================================
   ERROR MESSAGE
   ========================================================= */

function showSaveError(message) {

    const error =
        getElement(
            "saveError"
        );


    if (!error) {
        return;
    }


    error.textContent =
        message;

    error.style.display =
        "block";

}


/* =========================================================
   HIDE MESSAGES
   ========================================================= */

function hideMessages() {

    const success =
        getElement(
            "successMessage"
        );


    const error =
        getElement(
            "saveError"
        );


    if (success) {

        success.style.display =
            "none";

    }


    if (error) {

        error.style.display =
            "none";

    }

}


/* =========================================================
   TEMPORARY MESSAGE
   ========================================================= */

function showTemporaryMessage(message) {

    console.log(message);

    alert(message);

}
