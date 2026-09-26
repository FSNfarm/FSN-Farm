// ================================
// SUPABASE CONFIGURATION
// ================================

const SUPABASE_URL = "https://wdxhbnffddbjvljqwdsn.supabase.co";
const SUPABASE_KEY = "sb_publishable_0QshMmZk2xHqjOndQxKEnw_eigTr";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);// =============================================
// FSN FARM
// Poultry Farm Management System
// =============================================


// ==========================
// FORMAT ANGKA
// ==========================

function formatNumber(number) {

    return Number(number)
        .toLocaleString("id-ID");
}



// ==========================
// TANGGAL
// ==========================

function showCurrentDate() {

    const today = new Date();

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    document.getElementById(
        "currentDate"
    ).textContent =
        today.toLocaleDateString(
            "id-ID",
            options
        );
}



// ==========================
// DATA DEFAULT
// ==========================

let farmData = {

    initialChicken: 0,

    totalDeath: 0,

    feedStock: 0,

    totalFeedUsed: 0,

    averageWeight: 0

};



// ==========================
// LOAD DATA
// ==========================

function loadFarmData() {

    const savedData =
        localStorage.getItem(
            "fsnFarmData"
        );


    if (savedData) {

        farmData =
            JSON.parse(savedData);

    }


    updateDashboard();

}



// ==========================
// SIMPAN DATA
// ==========================

function saveFarmData() {

    localStorage.setItem(
        "fsnFarmData",
        JSON.stringify(farmData)
    );

}



// ==========================
// UPDATE DASHBOARD
// ==========================

function updateDashboard() {

    const liveChicken =
        Math.max(
            0,
            farmData.initialChicken -
            farmData.totalDeath
        );


    let mortality = 0;


    if (farmData.initialChicken > 0) {

        mortality =
            (
                farmData.totalDeath /
                farmData.initialChicken
            ) * 100;

    }


    // AYAM HIDUP

    document.getElementById(
        "liveChicken"
    ).textContent =
        formatNumber(liveChicken);


    // KEMATIAN

    document.getElementById(
        "deadChicken"
    ).textContent =
        formatNumber(
            farmData.totalDeath
        );


    // PAKAN

    document.getElementById(
        "feedStock"
    ).textContent =
        formatNumber(
            farmData.feedStock.toFixed(1)
        ) + " kg";


    // MORTALITAS

    const mortalityBox =
        document.querySelector(
            ".performance-box strong"
        );


    if (mortalityBox) {

        mortalityBox.textContent =
            mortality.toFixed(2)
            .replace(".", ",")
            + "%";

    }

}



// ==========================
// INPUT DATA HARIAN
// ==========================

document
.getElementById("saveDailyData")
.addEventListener(
    "click",
    function () {


        const initialChicken =
            Number(
                document
                .getElementById(
                    "initialChicken"
                ).value
            );


        const dailyDeath =
            Number(
                document
                .getElementById(
                    "dailyDeath"
                ).value
            );


        const initialFeed =
            Number(
                document
                .getElementById(
                    "initialFeed"
                ).value
            );


        const feedIncoming =
            Number(
                document
                .getElementById(
                    "feedIncoming"
                ).value
            );


        const feedUsed =
            Number(
                document
                .getElementById(
                    "feedUsed"
                ).value
            );


        const averageWeight =
            Number(
                document
                .getElementById(
                    "averageWeight"
                ).value
            );


        // POPULASI AWAL
        // hanya diubah jika diisi

        if (initialChicken > 0) {

            farmData.initialChicken =
                initialChicken;

        }


        // STOK PAKAN AWAL

        if (
            initialFeed > 0 &&
            farmData.feedStock === 0
        ) {

            farmData.feedStock =
                initialFeed;

        }


        // KEMATIAN

        farmData.totalDeath +=
            dailyDeath;


        // PAKAN

        farmData.feedStock +=
            feedIncoming;

        farmData.feedStock -=
            feedUsed;


        if (farmData.feedStock < 0) {

            farmData.feedStock = 0;

        }


        farmData.totalFeedUsed +=
            feedUsed;


        // BOBOT

        if (averageWeight > 0) {

            farmData.averageWeight =
                averageWeight;

        }


        // SIMPAN

        saveFarmData();


        // UPDATE DASHBOARD

        updateDashboard();


        // NOTIFIKASI

        const success =
            document.getElementById(
                "successMessage"
            );


        success.style.display =
            "block";


        setTimeout(
            function () {

                success.style.display =
                    "none";

            },
            3000
        );


        // RESET INPUT HARIAN

        document.getElementById(
            "dailyDeath"
        ).value = "";


        document.getElementById(
            "feedIncoming"
        ).value = "";


        document.getElementById(
            "feedUsed"
        ).value = "";

    }
);



// ==========================
// START SYSTEM
// ==========================

showCurrentDate();

loadFarmData();
const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");

if (hamburger && sidebar) {
  hamburger.addEventListener("click", function () {
    sidebar.classList.toggle("open");
  });
}
