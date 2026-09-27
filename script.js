/* =========================================================
   FSN FARM MANAGEMENT SYSTEM
   SCRIPT.JS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("FSN Farm System Loaded");


    /* =====================================================
       1. CONFIGURATION
       ===================================================== */

    /*
      LOGIN SEMENTARA

      Ganti email dan password ini sesuai keinginan.

      Nanti login bisa kita pindahkan ke Supabase Authentication.
    */

    const ADMIN_EMAIL = "admin@fsnfarm.com";
    const ADMIN_PASSWORD = "admin123";


    /*
      SUPABASE

      Untuk sementara dikosongkan agar website tetap bisa berjalan
      menggunakan localStorage.

      Nanti isi dengan Project URL dan Anon Key Supabase.
    */

    const SUPABASE_URL = "";
    const SUPABASE_ANON_KEY = "";

    let supabaseClient = null;


    if (
        SUPABASE_URL &&
        SUPABASE_ANON_KEY &&
        typeof window.supabase !== "undefined"
    ) {

        supabaseClient = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );

        console.log("Supabase connected");

    } else {

        console.log(
            "Supabase belum dikonfigurasi. Menggunakan localStorage."
        );

    }



    /* =====================================================
       2. ELEMENT SELECTORS
       ===================================================== */

    const loginPage = document.getElementById("loginPage");
    const farmApp = document.getElementById("farmApp");

    const loginForm = document.getElementById("loginForm");
    const loginEmail = document.getElementById("loginEmail");
    const loginPassword = document.getElementById("loginPassword");
    const loginError = document.getElementById("loginError");

    const currentDate = document.getElementById("currentDate");

    const sidebar = document.getElementById("sidebar");

    const hamburger =
        document.getElementById("hamburger") ||
        document.querySelector(".menu-toggle");

    const saveButton =
        document.getElementById("saveDailyData") ||
        document.querySelector(".save-button");

    const successMessage =
        document.getElementById("successMessage");


    /* INPUT */

    const initialChicken =
        document.getElementById("initialChicken");

    const dailyDeath =
        document.getElementById("dailyDeath");

    const initialFeed =
        document.getElementById("initialFeed");

    const feedIncoming =
        document.getElementById("feedIncoming");

    const feedUsed =
        document.getElementById("feedUsed");

    const averageWeight =
        document.getElementById("averageWeight");


    /* DASHBOARD OUTPUT */

    const liveChicken =
        document.getElementById("liveChicken");

    const feedStock =
        document.getElementById("feedStock");

    const deadChicken =
        document.getElementById("deadChicken");

    const harvestChicken =
        document.getElementById("harvestChicken");

    const feedPanelValue =
        document.getElementById("feedPanelValue");

    const mortalityRate =
        document.getElementById("mortalityRate");

    const weightValue =
        document.getElementById("weightValue");



    /* =====================================================
       3. HELPER FUNCTIONS
       ===================================================== */

    function number(value) {

        const result = Number(value);

        return Number.isFinite(result)
            ? result
            : 0;

    }


    function formatNumber(value) {

        return new Intl.NumberFormat("id-ID").format(
            number(value)
        );

    }


    function formatDecimal(value, digits = 2) {

        return number(value).toLocaleString(
            "id-ID",
            {
                minimumFractionDigits: digits,
                maximumFractionDigits: digits
            }
        );

    }



    /* =====================================================
       4. CURRENT DATE
       ===================================================== */

    function updateDate() {

        if (!currentDate) return;

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

    updateDate();



    /* =====================================================
       5. LOGIN SYSTEM
       ===================================================== */

    function showLogin() {

        if (loginPage) {
            loginPage.style.display = "flex";
        }

        if (farmApp) {
            farmApp.style.display = "none";
        }

    }


    function showDashboard() {

        if (loginPage) {
            loginPage.style.display = "none";
        }

        if (farmApp) {
            farmApp.style.display = "block";
        }

    }


    /*
       Periksa apakah sebelumnya sudah login.
    */

    const loginStatus =
        localStorage.getItem("fsnFarmLoggedIn");


    if (loginStatus === "true") {

        showDashboard();

    } else {

        showLogin();

    }



    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const email =
                    loginEmail
                        ? loginEmail.value.trim()
                        : "";

                const password =
                    loginPassword
                        ? loginPassword.value
                        : "";


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

                    showDashboard();

                    loadFarmData();

                } else {

                    if (loginError) {

                        loginError.style.display =
                            "block";

                        loginError.textContent =
                            "Email atau password salah.";

                    }

                }

            }
        );

    }



    /* =====================================================
       6. LOGOUT FUNCTION
       ===================================================== */

    window.logoutFSNFarm = function () {

        localStorage.removeItem(
            "fsnFarmLoggedIn"
        );

        showLogin();

        if (loginPassword) {
            loginPassword.value = "";
        }

    };



    /* =====================================================
       7. MOBILE SIDEBAR
       ===================================================== */

    if (hamburger && sidebar) {

        hamburger.addEventListener(
            "click",
            function () {

                sidebar.classList.toggle("open");

            }
        );

    }


    /*
      Tutup sidebar setelah menu ditekan
      pada layar kecil.
    */

    const menuItems =
        document.querySelectorAll(".menu-item");


    menuItems.forEach((item) => {

        item.addEventListener(
            "click",
            function () {

                menuItems.forEach((menu) => {
                    menu.classList.remove("active");
                });

                this.classList.add("active");


                if (
                    window.innerWidth <= 800 &&
                    sidebar
                ) {

                    sidebar.classList.remove("open");

                }

            }
        );

    });



    /* =====================================================
       8. FARM CALCULATION
       ===================================================== */

    function calculateFarm(data) {

        const population =
            number(data.initialChicken);

        const deaths =
            number(data.dailyDeath);

        const startingFeed =
            number(data.initialFeed);

        const incomingFeed =
            number(data.feedIncoming);

        const usedFeed =
            number(data.feedUsed);

        const weight =
            number(data.averageWeight);


        /*
           AYAM HIDUP
        */

        const alive =
            Math.max(
                population - deaths,
                0
            );


        /*
           STOK PAKAN

           stok awal
           + pakan masuk
           - pakan digunakan
        */

        const remainingFeed =
            Math.max(
                startingFeed +
                incomingFeed -
                usedFeed,
                0
            );


        /*
           MORTALITAS
        */

        let mortality = 0;

        if (population > 0) {

            mortality =
                (deaths / population) * 100;

        }


        /*
           ESTIMASI SIAP PANEN

           Untuk sekarang sama dengan ayam hidup.

           Nanti dapat dibuat berdasarkan umur,
           bobot dan target panen.
        */

        const harvest =
            alive;


        return {

            alive,
            remainingFeed,
            mortality,
            harvest,
            weight

        };

    }



    /* =====================================================
       9. UPDATE DASHBOARD
       ===================================================== */

    function updateDashboard(data) {

        const calculation =
            calculateFarm(data);


        if (liveChicken) {

            liveChicken.textContent =
                formatNumber(
                    calculation.alive
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
                    calculation.remainingFeed
                ) + " kg";

        }


        if (harvestChicken) {

            harvestChicken.textContent =
                formatNumber(
                    calculation.harvest
                );

        }


        if (feedPanelValue) {

            feedPanelValue.textContent =
                formatNumber(
                    calculation.remainingFeed
                );

        }


        if (mortalityRate) {

            mortalityRate.textContent =
                formatDecimal(
                    calculation.mortality
                ) + "%";

        }


        if (weightValue) {

            weightValue.textContent =
                formatDecimal(
                    calculation.weight
                ) + " kg";

        }


        updateFeedProgress(
            calculation.remainingFeed
        );

    }



    /* =====================================================
       10. FEED PROGRESS
       ===================================================== */

    function updateFeedProgress(feed) {

        const capacity = 5000;

        let percentage =
            (number(feed) / capacity) * 100;


        percentage =
            Math.max(
                0,
                Math.min(
                    percentage,
                    100
                )
            );


        const progressBar =
            document.querySelector(
                ".progress-fill, .feed-progress-bar"
            );


        if (progressBar) {

            progressBar.style.width =
                percentage + "%";

        }

    }



    /* =====================================================
       11. GET FORM DATA
       ===================================================== */

    function getFormData() {

        return {

            initialChicken:
                number(
                    initialChicken
                        ? initialChicken.value
                        : 0
                ),

            dailyDeath:
                number(
                    dailyDeath
                        ? dailyDeath.value
                        : 0
                ),

            initialFeed:
                number(
                    initialFeed
                        ? initialFeed.value
                        : 0
                ),

            feedIncoming:
                number(
                    feedIncoming
                        ? feedIncoming.value
                        : 0
                ),

            feedUsed:
                number(
                    feedUsed
                        ? feedUsed.value
                        : 0
                ),

            averageWeight:
                number(
                    averageWeight
                        ? averageWeight.value
                        : 0
                ),

            date:
                new Date().toISOString(),

            savedAt:
                Date.now()

        };

    }



    /* =====================================================
       12. SAVE LOCAL DATA
       ===================================================== */

    function saveLocalData(data) {

        /*
           Data terbaru
        */

        localStorage.setItem(
            "fsnFarmCurrentData",
            JSON.stringify(data)
        );


        /*
           History
        */

        let history = [];

        try {

            history =
                JSON.parse(
                    localStorage.getItem(
                        "fsnFarmHistory"
                    )
                ) || [];

        } catch (error) {

            history = [];

        }


        history.unshift(data);


        /*
           Batasi history supaya browser
           tidak menyimpan terlalu banyak.
        */

        if (history.length > 100) {

            history =
                history.slice(0, 100);

        }


        localStorage.setItem(
            "fsnFarmHistory",
            JSON.stringify(history)
        );

    }



    /* =====================================================
       13. SAVE TO SUPABASE
       ===================================================== */

    async function saveToSupabase(data) {

        if (!supabaseClient) {

            return {
                success: false,
                skipped: true
            };

        }


        try {

            const calculation =
                calculateFarm(data);


            const databaseData = {

                initial_chicken:
                    data.initialChicken,

                daily_death:
                    data.dailyDeath,

                initial_feed:
                    data.initialFeed,

                feed_incoming:
                    data.feedIncoming,

                feed_used:
                    data.feedUsed,

                average_weight:
                    data.averageWeight,

                live_chicken:
                    calculation.alive,

                feed_stock:
                    calculation.remainingFeed,

                mortality_rate:
                    calculation.mortality,

                created_at:
                    new Date().toISOString()

            };


            const { error } =
                await supabaseClient
                    .from("farm_daily_data")
                    .insert([databaseData]);


            if (error) {

                console.error(
                    "Supabase error:",
                    error
                );

                return {
                    success: false,
                    error
                };

            }


            console.log(
                "Data saved to Supabase"
            );


            return {
                success: true
            };


        } catch (error) {

            console.error(
                "Supabase save error:",
                error
            );


            return {
                success: false,
                error
            };

        }

    }



    /* =====================================================
       14. SAVE FARM DATA
       ===================================================== */

    async function saveFarmData() {

        const data =
            getFormData();


        /*
           VALIDATION
        */

        if (data.initialChicken < 0) {

            alert(
                "Populasi ayam tidak boleh negatif."
            );

            return;

        }


        if (
            data.dailyDeath >
            data.initialChicken
        ) {

            alert(
                "Jumlah ayam mati tidak boleh lebih besar dari populasi awal."
            );

            return;

        }


        if (
            data.initialFeed < 0 ||
            data.feedIncoming < 0 ||
            data.feedUsed < 0
        ) {

            alert(
                "Data pakan tidak boleh negatif."
            );

            return;

        }


        /*
           Disable button saat menyimpan
        */

        if (saveButton) {

            saveButton.disabled = true;

            saveButton.textContent =
                "⏳ Menyimpan...";

        }


        try {

            /*
               LOCAL STORAGE

               Ini memastikan data tetap tersimpan
               walaupun Supabase belum aktif.
            */

            saveLocalData(data);


            /*
               UPDATE DASHBOARD
            */

            updateDashboard(data);


            /*
               SUPABASE
            */

            await saveToSupabase(data);


            /*
               SUCCESS MESSAGE
            */

            showSuccessMessage();


            console.log(
                "Farm data saved:",
                data
            );


        } catch (error) {

            console.error(
                "Save error:",
                error
            );


            alert(
                "Terjadi kesalahan saat menyimpan data."
            );


        } finally {

            if (saveButton) {

                saveButton.disabled = false;

                saveButton.textContent =
                    "💾 Simpan Data Hari Ini";

            }

        }

    }



    /* =====================================================
       15. SAVE BUTTON
       ===================================================== */

    if (saveButton) {

        saveButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                saveFarmData();

            }
        );

    }



    /* =====================================================
       16. SUCCESS MESSAGE
       ===================================================== */

    function showSuccessMessage() {

        if (!successMessage) return;


        successMessage.style.display =
            "block";


        successMessage.textContent =
            "✓ Data peternakan berhasil disimpan";


        setTimeout(() => {

            successMessage.style.display =
                "none";

        }, 3500);

    }



    /* =====================================================
       17. LOAD SAVED FARM DATA
       ===================================================== */

    function loadFarmData() {

        const storedData =
            localStorage.getItem(
                "fsnFarmCurrentData"
            );


        if (!storedData) {

            updateDashboard({

                initialChicken: 0,
                dailyDeath: 0,
                initialFeed: 0,
                feedIncoming: 0,
                feedUsed: 0,
                averageWeight: 0

            });

            return;

        }


        try {

            const data =
                JSON.parse(storedData);


            /*
               Isi kembali form.
            */

            if (initialChicken) {

                initialChicken.value =
                    data.initialChicken ?? "";

            }


            if (dailyDeath) {

                dailyDeath.value =
                    data.dailyDeath ?? "";

            }


            if (initialFeed) {

                initialFeed.value =
                    data.initialFeed ?? "";

            }


            if (feedIncoming) {

                feedIncoming.value =
                    data.feedIncoming ?? "";

            }


            if (feedUsed) {

                feedUsed.value =
                    data.feedUsed ?? "";

            }


            if (averageWeight) {

                averageWeight.value =
                    data.averageWeight ?? "";

            }


            updateDashboard(data);


        } catch (error) {

            console.error(
                "Tidak dapat membaca data:",
                error
            );

        }

    }



    /* =====================================================
       18. LIVE PREVIEW WHILE INPUTTING
       ===================================================== */

    const farmInputs = [

        initialChicken,
        dailyDeath,
        initialFeed,
        feedIncoming,
        feedUsed,
        averageWeight

    ];


    farmInputs.forEach((input) => {

        if (!input) return;


        input.addEventListener(
            "input",
            function () {

                const previewData =
                    getFormData();


                updateDashboard(
                    previewData
                );

            }
        );

    });



    /* =====================================================
       19. RESET DAILY INPUT
       ===================================================== */

    window.resetFSNFarmData = function () {

        const confirmed =
            confirm(
                "Apakah Anda yakin ingin menghapus data FSN Farm yang tersimpan di perangkat ini?"
            );


        if (!confirmed) return;


        localStorage.removeItem(
            "fsnFarmCurrentData"
        );


        localStorage.removeItem(
            "fsnFarmHistory"
        );


        if (initialChicken) {
            initialChicken.value = "";
        }

        if (dailyDeath) {
            dailyDeath.value = "";
        }

        if (initialFeed) {
            initialFeed.value = "";
        }

        if (feedIncoming) {
            feedIncoming.value = "";
        }

        if (feedUsed) {
            feedUsed.value = "";
        }

        if (averageWeight) {
            averageWeight.value = "";
        }


        updateDashboard({

            initialChicken: 0,
            dailyDeath: 0,
            initialFeed: 0,
            feedIncoming: 0,
            feedUsed: 0,
            averageWeight: 0

        });


        alert(
            "Data lokal berhasil direset."
        );

    };



    /* =====================================================
       20. INITIAL LOAD
       ===================================================== */

    loadFarmData();


    console.log(
        "FSN Farm Dashboard Ready"
    );

});
