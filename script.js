/* =========================================================
   FSN FARM MANAGEMENT SYSTEM
   FINAL SCRIPT.JS
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENT
       ===================================================== */

    const loginPage = document.getElementById("loginPage");
    const farmApp = document.getElementById("farmApp");

    const loginForm = document.getElementById("loginForm");
    const loginEmail = document.getElementById("loginEmail");
    const loginPassword = document.getElementById("loginPassword");
    const loginError = document.getElementById("loginError");

    const logoutButton = document.getElementById("logoutButton");

    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menuToggle");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    const currentDate = document.getElementById("currentDate");

    const saveButton = document.getElementById("saveDailyData");
    const successMessage = document.getElementById("successMessage");



    /* =====================================================
       LOGIN CONFIGURATION
       GANTI EMAIL DAN PASSWORD DI SINI
       ===================================================== */

    const ADMIN_EMAIL = "admin@fsnfarm.com";
    const ADMIN_PASSWORD = "123456";



    /* =====================================================
       SHOW LOGIN
       ===================================================== */

    function showLogin() {

        if (loginPage) {
            loginPage.style.display = "flex";
        }

        if (farmApp) {
            farmApp.style.display = "none";
        }

    }



    /* =====================================================
       SHOW DASHBOARD
       ===================================================== */

    function showDashboard() {

        if (loginPage) {
            loginPage.style.display = "none";
        }

        if (farmApp) {
            farmApp.style.display = "block";
        }

        loadFarmData();
    }



    /* =====================================================
       CHECK LOGIN SESSION
       ===================================================== */

    const loginStatus =
        localStorage.getItem("fsnFarmLoggedIn");

    if (loginStatus === "true") {

        showDashboard();

    } else {

        showLogin();

    }
/* =====================================================
   LOGIN FSN FARM
   ===================================================== */

const loginButton = document.getElementById("loginButton");

if (loginButton) {

    loginButton.addEventListener("click", function () {

        const email = loginEmail.value.trim();
        const password = loginPassword.value.trim();

        console.log("Login button clicked");

        if (
            email === ADMIN_EMAIL &&
            password === ADMIN_PASSWORD
        ) {

            localStorage.setItem(
                "fsnFarmLoggedIn",
                "true"
            );

            if (loginError) {
                loginError.style.display = "none";
            }

            loginPage.style.display = "none";
            farmApp.style.display = "block";

            loadFarmData();

        } else {

            if (loginError) {
                loginError.style.display = "block";
                loginError.textContent =
                    "Email atau password salah.";
            }

        }

    });

}
    /* =====================================================
       LOGOUT
       ===================================================== */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function () {

                localStorage.removeItem(
                    "fsnFarmLoggedIn"
                );

                showLogin();

            }
        );

    }



    /* =====================================================
       DATE
       ===================================================== */

    function updateDate() {

        if (!currentDate) return;

        const today = new Date();

        const formatter =
            new Intl.DateTimeFormat(
                "id-ID",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );

        currentDate.textContent =
            formatter.format(today);

    }

    updateDate();



    /* =====================================================
       SIDEBAR MOBILE / IPAD
       ===================================================== */

    function openSidebar() {

        if (sidebar) {
            sidebar.classList.add("open");
        }

        if (sidebarOverlay) {
            sidebarOverlay.classList.add("show");
        }

    }


    function closeSidebar() {

        if (sidebar) {
            sidebar.classList.remove("open");
        }

        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("show");
        }

    }


    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            function () {

                if (
                    sidebar &&
                    sidebar.classList.contains("open")
                ) {

                    closeSidebar();

                } else {

                    openSidebar();

                }

            }
        );

    }


    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            closeSidebar
        );

    }



    /* =====================================================
       SIDEBAR MENU ACTIVE
       ===================================================== */

    const menuItems =
        document.querySelectorAll(".menu-item");

    menuItems.forEach(function (item) {

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

                item.classList.add("active");

                if (
                    window.innerWidth <= 850
                ) {

                    closeSidebar();

                }

            }
        );

    });



    /* =====================================================
       INPUT ELEMENTS
       ===================================================== */

    const initialChicken =
        document.getElementById(
            "initialChicken"
        );

    const dailyDeath =
        document.getElementById(
            "dailyDeath"
        );

    const initialFeed =
        document.getElementById(
            "initialFeed"
        );

    const feedIncoming =
        document.getElementById(
            "feedIncoming"
        );

    const feedUsed =
        document.getElementById(
            "feedUsed"
        );

    const averageWeight =
        document.getElementById(
            "averageWeight"
        );



    /* =====================================================
       DASHBOARD OUTPUT
       ===================================================== */

    const liveChicken =
        document.getElementById(
            "liveChicken"
        );

    const deadChicken =
        document.getElementById(
            "deadChicken"
        );

    const feedStock =
        document.getElementById(
            "feedStock"
        );

    const harvestChicken =
        document.getElementById(
            "harvestChicken"
        );

    const feedPanelValue =
        document.getElementById(
            "feedPanelValue"
        );

    const mortalityRate =
        document.getElementById(
            "mortalityRate"
        );

    const weightValue =
        document.getElementById(
            "weightValue"
        );

    const feedProgressBar =
        document.getElementById(
            "feedProgressBar"
        );



    /* =====================================================
       NUMBER HELPER
       ===================================================== */

    function getNumber(element) {

        if (!element) return 0;

        const value =
            parseFloat(element.value);

        if (isNaN(value)) {
            return 0;
        }

        return value;

    }



    /* =====================================================
       FORMAT NUMBER INDONESIA
       ===================================================== */

    function formatNumber(number) {

        return new Intl.NumberFormat(
            "id-ID"
        ).format(number);

    }



    /* =====================================================
       CALCULATE FARM DATA
       ===================================================== */

    function calculateFarmData(data) {

        const initial =
            Number(data.initialChicken) || 0;

        const deaths =
            Number(data.dailyDeath) || 0;

        const feedInitial =
            Number(data.initialFeed) || 0;

        const incoming =
            Number(data.feedIncoming) || 0;

        const used =
            Number(data.feedUsed) || 0;

        const weight =
            Number(data.averageWeight) || 0;


        /* LIVE CHICKEN */

        let live =
            initial - deaths;

        if (live < 0) {
            live = 0;
        }


        /* FEED */

        let feed =
            feedInitial +
            incoming -
            used;

        if (feed < 0) {
            feed = 0;
        }


        /* MORTALITY */

        let mortality = 0;

        if (initial > 0) {

            mortality =
                (deaths / initial) * 100;

        }


        /* HARVEST ESTIMATION

           Untuk sekarang:
           ayam dianggap mendekati siap panen
           jika bobot >= 1.8 kg.

        */

        let harvest = 0;

        if (weight >= 1.8) {

            harvest = live;

        }


        return {

            initialChicken: initial,

            dailyDeath: deaths,

            liveChicken: live,

            initialFeed: feedInitial,

            feedIncoming: incoming,

            feedUsed: used,

            feedStock: feed,

            averageWeight: weight,

            mortalityRate: mortality,

            harvestChicken: harvest,

            date: new Date().toISOString()

        };

    }



    /* =====================================================
       UPDATE DASHBOARD
       ===================================================== */

    function updateDashboard(data) {

        if (!data) return;


        if (liveChicken) {

            liveChicken.textContent =
                formatNumber(
                    data.liveChicken
                );

        }


        if (deadChicken) {

            deadChicken.textContent =
                formatNumber(
                    data.dailyDeath
                );

        }


        if (feedStock) {

            feedStock.textContent =
                formatNumber(
                    data.feedStock
                ) + " kg";

        }


        if (feedPanelValue) {

            feedPanelValue.textContent =
                formatNumber(
                    data.feedStock
                );

        }


        if (harvestChicken) {

            harvestChicken.textContent =
                formatNumber(
                    data.harvestChicken
                );

        }


        if (mortalityRate) {

            mortalityRate.textContent =
                data.mortalityRate
                    .toFixed(2) + "%";

        }


        if (weightValue) {

            weightValue.textContent =
                data.averageWeight
                    .toFixed(2) + " kg";

        }


        /* FEED PROGRESS */

        if (feedProgressBar) {

            const capacity = 5000;

            let percentage =
                (
                    data.feedStock /
                    capacity
                ) * 100;

            if (percentage > 100) {
                percentage = 100;
            }

            if (percentage < 0) {
                percentage = 0;
            }

            feedProgressBar.style.width =
                percentage + "%";

        }

    }



    /* =====================================================
       SAVE DAILY DATA
       ===================================================== */

    if (saveButton) {

        saveButton.addEventListener(
            "click",
            function () {

                const inputData = {

                    initialChicken:
                        getNumber(
                            initialChicken
                        ),

                    dailyDeath:
                        getNumber(
                            dailyDeath
                        ),

                    initialFeed:
                        getNumber(
                            initialFeed
                        ),

                    feedIncoming:
                        getNumber(
                            feedIncoming
                        ),

                    feedUsed:
                        getNumber(
                            feedUsed
                        ),

                    averageWeight:
                        getNumber(
                            averageWeight
                        )

                };


                /* VALIDATION */

                if (
                    inputData.dailyDeath >
                    inputData.initialChicken
                ) {

                    alert(
                        "Jumlah ayam mati tidak boleh melebihi populasi awal."
                    );

                    return;

                }


                if (
                    inputData.feedUsed >
                    (
                        inputData.initialFeed +
                        inputData.feedIncoming
                    )
                ) {

                    alert(
                        "Pakan digunakan melebihi stok pakan tersedia."
                    );

                    return;

                }


                const calculatedData =
                    calculateFarmData(
                        inputData
                    );


                /* SAVE CURRENT DATA */

                localStorage.setItem(
                    "fsnFarmData",
                    JSON.stringify(
                        calculatedData
                    )
                );


                /* SAVE HISTORY */

                saveHistory(
                    calculatedData
                );


                /* UPDATE DASHBOARD */

                updateDashboard(
                    calculatedData
                );


                /* SUCCESS MESSAGE */

                if (successMessage) {

                    successMessage.style.display =
                        "block";

                    successMessage.textContent =
                        "✓ Data peternakan berhasil disimpan";

                    setTimeout(
                        function () {

                            successMessage.style.display =
                                "none";

                        },
                        3000
                    );

                }

            }
        );

    }



    /* =====================================================
       SAVE HISTORY
       ===================================================== */

    function saveHistory(data) {

        let history = [];

        const existingHistory =
            localStorage.getItem(
                "fsnFarmHistory"
            );


        if (existingHistory) {

            try {

                history =
                    JSON.parse(
                        existingHistory
                    );

            } catch (error) {

                history = [];

            }

        }


        history.unshift(data);


        /* SIMPAN MAKSIMAL 30 DATA */

        if (history.length > 30) {

            history =
                history.slice(0, 30);

        }


        localStorage.setItem(
            "fsnFarmHistory",
            JSON.stringify(history)
        );


        renderHistory();

    }



    /* =====================================================
       LOAD FARM DATA
       ===================================================== */

    function loadFarmData() {

        const storedData =
            localStorage.getItem(
                "fsnFarmData"
            );


        if (!storedData) {

            updateDashboard({

                liveChicken: 0,

                dailyDeath: 0,

                feedStock: 0,

                harvestChicken: 0,

                mortalityRate: 0,

                averageWeight: 0

            });

            renderHistory();

            return;

        }


        try {

            const data =
                JSON.parse(storedData);


            updateDashboard(data);


            /* RESTORE INPUT */

            if (initialChicken) {

                initialChicken.value =
                    data.initialChicken || "";

            }


            if (dailyDeath) {

                dailyDeath.value =
                    data.dailyDeath || "";

            }


            if (initialFeed) {

                initialFeed.value =
                    data.initialFeed || "";

            }


            if (feedIncoming) {

                feedIncoming.value =
                    data.feedIncoming || "";

            }


            if (feedUsed) {

                feedUsed.value =
                    data.feedUsed || "";

            }


            if (averageWeight) {

                averageWeight.value =
                    data.averageWeight || "";

            }


        } catch (error) {

            console.error(
                "Gagal membaca data FSN Farm:",
                error
            );

        }


        renderHistory();

    }



    /* =====================================================
       HISTORY TABLE
       ===================================================== */

    function renderHistory() {

        const tableBody =
            document.getElementById(
                "historyTableBody"
            );


        if (!tableBody) return;


        const storedHistory =
            localStorage.getItem(
                "fsnFarmHistory"
            );


        if (!storedHistory) {

            tableBody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="6">
                        Belum ada data peternakan.
                    </td>
                </tr>
            `;

            return;

        }


        let history;


        try {

            history =
                JSON.parse(
                    storedHistory
                );

        } catch (error) {

            history = [];

        }


        if (
            !Array.isArray(history) ||
            history.length === 0
        ) {

            tableBody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="6">
                        Belum ada data peternakan.
                    </td>
                </tr>
            `;

            return;

        }


        tableBody.innerHTML = "";


        history
            .slice(0, 10)
            .forEach(function (item) {

                const row =
                    document.createElement(
                        "tr"
                    );


                const date =
                    new Date(item.date);


                const formattedDate =
                    date.toLocaleDateString(
                        "id-ID",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        }
                    );


                row.innerHTML = `

                    <td>
                        ${formattedDate}
                    </td>

                    <td>
                        ${formatNumber(
                            item.liveChicken || 0
                        )}
                    </td>

                    <td>
                        ${formatNumber(
                            item.dailyDeath || 0
                        )}
                    </td>

                    <td>
                        ${formatNumber(
                            item.feedStock || 0
                        )} kg
                    </td>

                    <td>
                        ${
                            Number(
                                item.averageWeight || 0
                            ).toFixed(2)
                        } kg
                    </td>

                    <td>
                        ${
                            Number(
                                item.mortalityRate || 0
                            ).toFixed(2)
                        }%
                    </td>

                `;


                tableBody.appendChild(row);

            });

    }



    /* =====================================================
       LIVE PREVIEW INPUT
       ===================================================== */

    const farmInputs = [

        initialChicken,
        dailyDeath,
        initialFeed,
        feedIncoming,
        feedUsed,
        averageWeight

    ];


    farmInputs.forEach(
        function (input) {

            if (!input) return;


            input.addEventListener(
                "input",
                function () {

                    const preview =
                        calculateFarmData({

                            initialChicken:
                                getNumber(
                                    initialChicken
                                ),

                            dailyDeath:
                                getNumber(
                                    dailyDeath
                                ),

                            initialFeed:
                                getNumber(
                                    initialFeed
                                ),

                            feedIncoming:
                                getNumber(
                                    feedIncoming
                                ),

                            feedUsed:
                                getNumber(
                                    feedUsed
                                ),

                            averageWeight:
                                getNumber(
                                    averageWeight
                                )

                        });


                    updateDashboard(
                        preview
                    );

                }
            );

        }
    );



    /* =====================================================
       WINDOW RESIZE
       ===================================================== */

    window.addEventListener(
        "resize",
        function () {

            if (
                window.innerWidth > 850
            ) {

                closeSidebar();

            }

        }
    );



    /* =====================================================
       INITIAL DATA LOAD
       ===================================================== */

    if (
        localStorage.getItem(
            "fsnFarmLoggedIn"
        ) === "true"
    ) {

        loadFarmData();

    }


    console.log(
        "FSN Farm Management System loaded successfully."
    );

});
