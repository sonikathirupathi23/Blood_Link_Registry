/* =========================================================
   BLOODLINK
   Blood Donor Management System
========================================================= */

const API_BASE = "/api";

let donors = [];
let bloodGroups = [];
let donations = [];


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    setupNavigation();

    setupGlobalActions();

    loadApplication();

});


async function loadApplication() {

    try {

        await Promise.all([
            loadBloodGroups(),
            loadDonors(),
            loadDonations()
        ]);

        loadDashboard();

        setApiStatus(true);

    } catch (error) {

        console.error(error);

        setApiStatus(false);

        showToast("Unable to connect to the application API.");

    }

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    document.querySelectorAll(".nav-item").forEach(function (button) {

        button.addEventListener("click", function () {

            const section =
                this.getAttribute("data-section");

            navigateTo(section);

        });

    });


    document.querySelectorAll("[data-section-link]").forEach(function (button) {

        button.addEventListener("click", function () {

            const section =
                this.getAttribute("data-section-link");

            navigateTo(section);

        });

    });

}


function navigateTo(sectionId) {

    document.querySelectorAll(".page-section").forEach(function (section) {

        section.classList.remove("active");

    });


    const selected =
        document.getElementById(sectionId);

    if (selected) {

        selected.classList.add("active");

    }


    document.querySelectorAll(".nav-item").forEach(function (button) {

        button.classList.remove("active");

    });


    const activeButton =
        document.querySelector(
            `.nav-item[data-section="${sectionId}"]`
        );


    if (activeButton) {

        activeButton.classList.add("active");

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    if (sectionId === "dashboard") {
        loadDashboard();
    }

    if (sectionId === "donors") {
        renderDonors(donors);
    }

    if (sectionId === "find-donor") {

        populateBloodGroupSelects();

    }

    if (sectionId === "donations") {
        renderDonations(donations);
    }

    if (sectionId === "blood-groups") {
        renderBloodGroupTable();
    }

}


/* =========================================================
   GLOBAL ACTIONS
========================================================= */

function setupGlobalActions() {

    document
        .getElementById("addDonorBtn")
        .addEventListener("click", function () {

            openDonorForm();

        });


    document
        .getElementById("addDonationBtn")
        .addEventListener("click", function () {

            openDonationForm();

        });


    document
        .getElementById("donorSearchBtn")
        .addEventListener("click", function () {

            searchDonors();

        });


    document
        .getElementById("clearDonorSearchBtn")
        .addEventListener("click", function () {

            clearDonorSearch();

        });


    document
        .getElementById("findDonorBtn")
        .addEventListener("click", function () {

            findDonors();

        });


    document
        .getElementById("donationSearchBtn")
        .addEventListener("click", function () {

            searchDonations();

        });


    document
        .getElementById("clearDonationSearchBtn")
        .addEventListener("click", function () {

            clearDonationSearch();

        });


    document
        .getElementById("closeModalBtn")
        .addEventListener("click", closeModal);


    document
        .getElementById("modalOverlay")
        .addEventListener("click", function (event) {

            if (event.target === this) {

                closeModal();

            }

        });

}


/* =========================================================
   API
========================================================= */

async function apiRequest(endpoint, options = {}) {

    const response =
        await fetch(API_BASE + endpoint, {

            ...options,

            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            }

        });


    if (!response.ok) {

        const message =
            await response.text();

        throw new Error(
            message || `HTTP ${response.status}`
        );

    }


    if (response.status === 204) {

        return null;

    }


    return await response.json();

}


/* =========================================================
   API STATUS
========================================================= */

function setApiStatus(connected) {

    const dot =
        document.getElementById("apiDot");

    const text =
        document.getElementById("apiStatusText");


    if (connected) {

        dot.classList.remove("error");

        text.textContent =
            "System Online";

    } else {

        dot.classList.add("error");

        text.textContent =
            "API Unavailable";

    }

}


/* =========================================================
   DASHBOARD
========================================================= */

async function loadDashboard() {

    try {

        if (
            !donors.length &&
            !bloodGroups.length &&
            !donations.length
        ) {

            await Promise.all([
                loadBloodGroups(),
                loadDonors(),
                loadDonations()
            ]);

        }


        document.getElementById(
            "totalDonors"
        ).textContent = donors.length;


        document.getElementById(
            "totalGroups"
        ).textContent = bloodGroups.length;


        document.getElementById(
            "totalDonations"
        ).textContent = donations.length;


        const eligible =
            donors.filter(
                isDonorEligible
            );


        document.getElementById(
            "eligibleDonors"
        ).textContent =
            eligible.length;


        renderDashboardBloodGroups();

        renderRecentDonations();

    } catch (error) {

        console.error(error);

    }

}


/* =========================================================
   BLOOD GROUPS
========================================================= */

async function loadBloodGroups() {

    const data =
        await apiRequest(
            "/blood-groups"
        );


    bloodGroups =
        Array.isArray(data)
            ? data
            : [];


    populateBloodGroupSelects();

    renderDashboardBloodGroups();

    renderBloodGroupTable();

}


function populateBloodGroupSelects() {

    const selects = [

        document.getElementById(
            "donorBloodGroupFilter"
        ),

        document.getElementById(
            "findBloodGroup"
        ),

        document.getElementById(
            "donationBloodGroupFilter"
        )

    ];


    selects.forEach(function (select) {

        if (!select) {
            return;
        }


        const oldValue =
            select.value;


        const firstText =
            select.id === "findBloodGroup"
                ? "Select blood group"
                : "All groups";


        select.innerHTML =
            `<option value="">
                ${firstText}
            </option>`;


        bloodGroups.forEach(function (group) {

            select.innerHTML += `
                <option value="${group.id}">
                    ${escapeHtml(group.name)}
                </option>
            `;

        });


        select.value =
            oldValue;

    });

}


/* =========================================================
   BLOOD GROUP DASHBOARD
========================================================= */

function renderDashboardBloodGroups() {

    const container =
        document.getElementById(
            "dashboardBloodGroups"
        );


    if (!container) {
        return;
    }


    if (!bloodGroups.length) {

        container.innerHTML =
            `<div class="loading-state">
                No blood group data available.
            </div>`;

        return;

    }


    container.innerHTML =
        bloodGroups.map(function (group) {

            const count =
                Number(group.donorCount || 0);


            return `
                <div class="blood-overview-item">

                    <div class="blood-type">
                        ${escapeHtml(group.name)}
                    </div>

                    <div class="blood-count">
                        ${count}
                    </div>

                    <div class="blood-label">
                        registered
                    </div>

                </div>
            `;

        }).join("");

}


/* =========================================================
   BLOOD GROUP TABLE
========================================================= */

function renderBloodGroupTable() {

    const body =
        document.getElementById(
            "bloodGroupTableBody"
        );


    if (!body) {
        return;
    }


    if (!bloodGroups.length) {

        body.innerHTML = `
            <tr>
                <td colspan="3" class="empty-state">
                    No blood groups available.
                </td>
            </tr>
        `;

        return;

    }


    body.innerHTML =
        bloodGroups.map(function (group) {

            const count =
                Number(group.donorCount || 0);


            let availability =
                "Available";


            let className =
                "eligible";


            if (count === 0) {

                availability =
                    "No registered donors";

                className =
                    "recent";

            } else if (count < 5) {

                availability =
                    "Limited";

                className =
                    "recent";

            }


            return `
                <tr>

                    <td>
                        <span class="blood-badge">
                            ${escapeHtml(group.name)}
                        </span>
                    </td>

                    <td>
                        ${count}
                    </td>

                    <td>
                        <span class="status-badge ${className}">
                            ${availability}
                        </span>
                    </td>

                </tr>
            `;

        }).join("");

}


/* =========================================================
   DONORS
========================================================= */

async function loadDonors() {

    const data =
        await apiRequest(
            "/donors"
        );


    donors =
        Array.isArray(data)
            ? data
            : [];


    renderDonors(donors);

    updateDonorCount();

}


/* =========================================================
   RENDER DONORS
========================================================= */

function renderDonors(list) {

    const body =
        document.getElementById(
            "donorTableBody"
        );


    if (!body) {
        return;
    }


    if (!list.length) {

        body.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    No donors found.
                </td>
            </tr>
        `;

        return;

    }


    body.innerHTML =
        list.map(function (donor) {

            const bloodGroup =
                getBloodGroupName(donor);


            const eligible =
                isDonorEligible(donor);


            const statusClass =
                eligible
                    ? "eligible"
                    : "recent";


            const statusText =
                eligible
                    ? "Eligible"
                    : "Recently donated";


            return `
                <tr>

                    <td>

                        <div class="donor-name">
                            ${escapeHtml(
                donor.fullName || "-"
            )}
                        </div>

                        <div class="donor-email">
                            ${escapeHtml(
                donor.email || ""
            )}
                        </div>

                    </td>


                    <td>

                        <span class="blood-badge">
                            ${escapeHtml(
                bloodGroup
            )}
                        </span>

                    </td>


                    <td>

                        <div>
                            ${escapeHtml(
                donor.phone || "-"
            )}
                        </div>

                    </td>


                    <td>
                        ${escapeHtml(
                donor.city || "-"
            )}
                    </td>


                    <td>
                        ${formatDate(
                donor.lastDonationDate
            )}
                    </td>


                    <td>

                        <span class="status-badge ${statusClass}">
                            ${statusText}
                        </span>

                    </td>


                    <td>

                        <div class="row-actions">

                            <button
                                class="action-button"
                                onclick="openDonorForm(${donor.id})"
                            >
                                Edit
                            </button>

                            <button
                                class="action-button delete"
                                onclick="deleteDonor(${donor.id})"
                            >
                                Delete
                            </button>

                        </div>

                    </td>

                </tr>
            `;

        }).join("");

}


function updateDonorCount() {

    const label =
        document.getElementById(
            "donorCountLabel"
        );


    if (label) {

        label.textContent =
            `${donors.length} registered donor${donors.length === 1 ? "" : "s"}`;

    }

}


/* =========================================================
   DONOR SEARCH
========================================================= */

async function searchDonors() {

    const search =
        document.getElementById(
            "donorSearchInput"
        ).value
            .trim()
            .toLowerCase();


    const bloodGroupId =
        document.getElementById(
            "donorBloodGroupFilter"
        ).value;


    const city =
        document.getElementById(
            "donorCityFilter"
        ).value
            .trim()
            .toLowerCase();


    let result =
        [...donors];


    if (search) {

        result =
            result.filter(function (donor) {

                return (

                    String(
                        donor.fullName || ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        donor.email || ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        donor.phone || ""
                    )
                        .toLowerCase()
                        .includes(search)

                );

            });

    }


    if (bloodGroupId) {

        result =
            result.filter(function (donor) {

                return String(
                    getBloodGroupId(donor)
                ) === String(bloodGroupId);

            });

    }


    if (city) {

        result =
            result.filter(function (donor) {

                return String(
                    donor.city || ""
                )
                    .toLowerCase()
                    .includes(city);

            });

    }


    renderDonors(result);


    document.getElementById(
        "donorCountLabel"
    ).textContent =
        `${result.length} matching donor${result.length === 1 ? "" : "s"}`;

}


function clearDonorSearch() {

    document.getElementById(
        "donorSearchInput"
    ).value = "";


    document.getElementById(
        "donorBloodGroupFilter"
    ).value = "";


    document.getElementById(
        "donorCityFilter"
    ).value = "";


    renderDonors(donors);

    updateDonorCount();

}


/* =========================================================
   FIND DONOR
========================================================= */

async function findDonors() {

    const bloodGroupId =
        document.getElementById(
            "findBloodGroup"
        ).value;


    const city =
        document.getElementById(
            "findCity"
        ).value
            .trim()
            .toLowerCase();


    const resultContainer =
        document.getElementById(
            "findDonorResults"
        );


    if (!bloodGroupId && !city) {

        resultContainer.innerHTML = `
            <div class="empty-search">

                <div class="empty-search-icon">
                    ⌕
                </div>

                <h3>Search criteria required</h3>

                <p>
                    Select a blood group or enter a location.
                </p>

            </div>
        `;

        return;

    }


    let result =
        [...donors];


    if (bloodGroupId) {

        result =
            result.filter(function (donor) {

                return String(
                    getBloodGroupId(donor)
                ) === String(bloodGroupId);

            });

    }


    if (city) {

        result =
            result.filter(function (donor) {

                return String(
                    donor.city || ""
                )
                    .toLowerCase()
                    .includes(city);

            });

    }


    result =
        result.filter(
            isDonorEligible
        );


    renderFindResults(result);


    document.getElementById(
        "findResultLabel"
    ).textContent =
        `${result.length} eligible donor${result.length === 1 ? "" : "s"} found`;

}


function renderFindResults(list) {

    const container =
        document.getElementById(
            "findDonorResults"
        );


    if (!list.length) {

        container.innerHTML = `
            <div class="empty-search">

                <h3>No eligible donors found</h3>

                <p>
                    No registered donor matches the selected criteria.
                </p>

            </div>
        `;

        return;

    }


    container.innerHTML =
        list.map(function (donor) {

            return `
                <div class="donor-result">

                    <div class="donor-result-info">

                        <div class="donor-result-name">
                            ${escapeHtml(
                donor.fullName
            )}
                        </div>

                        <div class="donor-result-meta">

                            ${escapeHtml(
                getBloodGroupName(donor)
            )}

                            &nbsp; • &nbsp;

                            ${escapeHtml(
                donor.city || "-"
            )}

                            &nbsp; • &nbsp;

                            ${escapeHtml(
                donor.phone || "-"
            )}

                        </div>

                    </div>


                    <div class="donor-result-status">

                        <span class="status-badge eligible">
                            Eligible to donate
                        </span>

                    </div>

                </div>
            `;

        }).join("");

}


/* =========================================================
   DONOR FORM
========================================================= */

function openDonorForm(id = null) {

    const donor =
        id
            ? donors.find(function (item) {

                return Number(item.id) ===
                    Number(id);

            })
            : null;


    const editing =
        Boolean(donor);


    openModal(

        editing
            ? "Edit Donor"
            : "Register Donor",

        `
        <form
            id="donorForm"
            class="modal-form"
        >

            <div class="form-grid">

                <div class="form-group full">

                    <label>
                        Full Name
                    </label>

                    <input
                        type="text"
                        id="formFullName"
                        value="${escapeAttribute(
            donor?.fullName || ""
        )}"
                        required
                    >

                </div>


                <div class="form-group">

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        id="formEmail"
                        value="${escapeAttribute(
            donor?.email || ""
        )}"
                        required
                    >

                </div>


                <div class="form-group">

                    <label>
                        Phone
                    </label>

                    <input
                        type="text"
                        id="formPhone"
                        value="${escapeAttribute(
            donor?.phone || ""
        )}"
                        required
                    >

                </div>


                <div class="form-group">

                    <label>
                        Blood Group
                    </label>

                    <select
                        id="formBloodGroup"
                        required
                    >

                        <option value="">
                            Select blood group
                        </option>

                        ${bloodGroups.map(function (group) {

            const selected =
                String(
                    getBloodGroupId(donor)
                ) ===
                String(group.id)
                    ? "selected"
                    : "";

            return `
                                <option
                                    value="${group.id}"
                                    ${selected}
                                >
                                    ${escapeHtml(
                group.name
            )}
                                </option>
                            `;

        }).join("")}

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        City
                    </label>

                    <input
                        type="text"
                        id="formCity"
                        value="${escapeAttribute(
            donor?.city || ""
        )}"
                        required
                    >

                </div>


                <div class="form-group full">

                    <label>
                        Last Donation Date
                    </label>

                    <input
                        type="date"
                        id="formLastDonation"
                        value="${escapeAttribute(
            donor?.lastDonationDate || ""
        )}"
                    >

                </div>

            </div>


            <div class="form-actions">

                <button
                    type="button"
                    class="secondary-button"
                    onclick="closeModal()"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    class="primary-button"
                >
                    ${editing
            ? "Save Changes"
            : "Register Donor"}
                </button>

            </div>

        </form>
        `
    );


    document
        .getElementById("donorForm")
        .addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                await saveDonor(id);

            }
        );

}


/* =========================================================
   SAVE DONOR
========================================================= */

async function saveDonor(id) {

    const payload = {

        fullName:
            document.getElementById(
                "formFullName"
            ).value.trim(),

        email:
            document.getElementById(
                "formEmail"
            ).value.trim(),

        phone:
            document.getElementById(
                "formPhone"
            ).value.trim(),

        city:
            document.getElementById(
                "formCity"
            ).value.trim(),

        bloodGroupId:
            Number(
                document.getElementById(
                    "formBloodGroup"
                ).value
            ),

        lastDonationDate:
            document.getElementById(
                "formLastDonation"
            ).value || null

    };


    try {

        if (id) {

            await apiRequest(
                `/donors/${id}`,
                {
                    method: "PUT",
                    body: JSON.stringify(payload)
                }
            );

            showToast(
                "Donor details updated."
            );

        } else {

            await apiRequest(
                "/donors",
                {
                    method: "POST",
                    body: JSON.stringify(payload)
                }
            );

            showToast(
                "Donor registered successfully."
            );

        }


        closeModal();

        await loadDonors();

        await loadBloodGroups();

        await loadDashboard();

    } catch (error) {

        console.error(error);

        showToast(
            "Unable to save donor."
        );

    }

}


/* =========================================================
   DELETE DONOR
========================================================= */

async function deleteDonor(id) {

    const donor =
        donors.find(function (item) {

            return Number(item.id) ===
                Number(id);

        });


    const confirmed =
        confirm(
            `Delete donor "${donor?.fullName || ""}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        await apiRequest(
            `/donors/${id}`,
            {
                method: "DELETE"
            }
        );


        showToast(
            "Donor removed successfully."
        );


        await loadDonors();

        await loadBloodGroups();

        await loadDashboard();

    } catch (error) {

        console.error(error);

        showToast(
            "Unable to delete donor."
        );

    }

}


/* =========================================================
   DONATIONS
========================================================= */

async function loadDonations() {

    const data =
        await apiRequest(
            "/donation-records"
        );


    donations =
        Array.isArray(data)
            ? data
            : [];


    renderDonations(donations);

    renderRecentDonations();

}


/* =========================================================
   RENDER DONATIONS
========================================================= */

function renderDonations(list) {

    const body =
        document.getElementById(
            "donationTableBody"
        );


    if (!list.length) {

        body.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    No donation records found.
                </td>
            </tr>
        `;

        updateDonationCount(0);

        return;

    }


    body.innerHTML =
        list.map(function (record) {

            const donor =
                record.donor || {};


            const donorName =
                record.donorName ||
                donor.fullName ||
                getDonorNameById(
                    record.donorId
                );


            const bloodGroup =
                getDonationBloodGroup(record);


            return `
                <tr>

                    <td>

                        <div class="donor-name">
                            ${escapeHtml(
                donorName || "-"
            )}
                        </div>

                    </td>


                    <td>

                        <span class="blood-badge">
                            ${escapeHtml(
                bloodGroup
            )}
                        </span>

                    </td>


                    <td>
                        ${formatDate(
                record.donationDate
            )}
                    </td>


                    <td>
                        ${escapeHtml(
                record.notes || "-"
            )}
                    </td>

                </tr>
            `;

        }).join("");


    updateDonationCount(
        list.length
    );

}


function updateDonationCount(count) {

    document.getElementById(
        "donationCountLabel"
    ).textContent =
        `${count} donation record${count === 1 ? "" : "s"}`;

}


/* =========================================================
   DONATION SEARCH
========================================================= */

function searchDonations() {

    const search =
        document.getElementById(
            "donationSearch"
        ).value
            .trim()
            .toLowerCase();


    const bloodGroupId =
        document.getElementById(
            "donationBloodGroupFilter"
        ).value;


    let result =
        [...donations];


    if (search) {

        result =
            result.filter(function (record) {

                const donor =
                    record.donor || {};


                const donorName =
                    record.donorName ||
                    donor.fullName ||
                    getDonorNameById(
                        record.donorId
                    );


                return String(
                    donorName || ""
                )
                    .toLowerCase()
                    .includes(search);

            });

    }


    if (bloodGroupId) {

        result =
            result.filter(function (record) {

                const donor =
                    record.donor || {};


                const donorGroupId =
                    donor.bloodGroupId ||
                    donor.bloodGroup?.id;


                return String(
                    donorGroupId
                ) === String(
                    bloodGroupId
                );

            });

    }


    renderDonations(result);

}


function clearDonationSearch() {

    document.getElementById(
        "donationSearch"
    ).value = "";


    document.getElementById(
        "donationBloodGroupFilter"
    ).value = "";


    renderDonations(
        donations
    );

}


/* =========================================================
   RECENT DONATIONS
========================================================= */

function renderRecentDonations() {

    const body =
        document.getElementById(
            "recentDonationsBody"
        );


    if (!body) {
        return;
    }


    const recent =
        [...donations]
            .sort(function (a, b) {

                return String(
                    b.donationDate || ""
                ).localeCompare(
                    String(
                        a.donationDate || ""
                    )
                );

            })
            .slice(0, 5);


    if (!recent.length) {

        body.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    No recent donations.
                </td>
            </tr>
        `;

        return;

    }


    body.innerHTML =
        recent.map(function (record) {

            const donor =
                record.donor || {};


            const donorName =
                record.donorName ||
                donor.fullName ||
                getDonorNameById(
                    record.donorId
                );


            return `
                <tr>

                    <td>
                        <div class="donor-name">
                            ${escapeHtml(
                donorName || "-"
            )}
                        </div>
                    </td>

                    <td>

                        <span class="blood-badge">
                            ${escapeHtml(
                getDonationBloodGroup(record)
            )}
                        </span>

                    </td>

                    <td>
                        ${formatDate(
                record.donationDate
            )}
                    </td>

                    <td>
                        ${escapeHtml(
                record.notes || "-"
            )}
                    </td>

                </tr>
            `;

        }).join("");

}


/* =========================================================
   ADD DONATION
========================================================= */

function openDonationForm() {

    openModal(

        "Record Donation",

        `
        <form
            id="donationForm"
            class="modal-form"
        >

            <div class="form-group">

                <label>
                    Donor
                </label>

                <select
                    id="formDonationDonor"
                    required
                >

                    <option value="">
                        Select donor
                    </option>

                    ${donors.map(function (donor) {

            return `
                            <option value="${donor.id}">
                                ${escapeHtml(
                donor.fullName
            )}
                                -
                                ${escapeHtml(
                getBloodGroupName(donor)
            )}
                            </option>
                        `;

        }).join("")}

                </select>

            </div>


            <div class="form-group">

                <label>
                    Donation Date
                </label>

                <input
                    type="date"
                    id="formDonationDate"
                    required
                >

            </div>


            <div class="form-group">

                <label>
                    Notes
                </label>

                <textarea
                    id="formDonationNotes"
                    placeholder="Optional donation notes"
                ></textarea>

            </div>


            <div class="form-actions">

                <button
                    type="button"
                    class="secondary-button"
                    onclick="closeModal()"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    class="primary-button"
                >
                    Record Donation
                </button>

            </div>

        </form>
        `
    );


    document
        .getElementById(
            "donationForm"
        )
        .addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                await saveDonation();

            }
        );

}


/* =========================================================
   SAVE DONATION
========================================================= */

async function saveDonation() {

    const payload = {

        donorId:
            Number(
                document.getElementById(
                    "formDonationDonor"
                ).value
            ),

        donationDate:
        document.getElementById(
            "formDonationDate"
        ).value,

        notes:
            document.getElementById(
                "formDonationNotes"
            ).value.trim()

    };


    try {

        await apiRequest(
            "/donation-records",
            {
                method: "POST",
                body: JSON.stringify(payload)
            }
        );


        closeModal();

        showToast(
            "Donation recorded successfully."
        );


        await loadDonations();

        await loadDonors();

        await loadBloodGroups();

        await loadDashboard();

    } catch (error) {

        console.error(error);

        showToast(
            "Unable to record donation."
        );

    }

}


/* =========================================================
   MODAL
========================================================= */

function openModal(title, content) {

    document.getElementById(
        "modalTitle"
    ).textContent = title;


    document.getElementById(
        "modalContent"
    ).innerHTML = content;


    document.getElementById(
        "modalOverlay"
    ).classList.add("show");

}


function closeModal() {

    document.getElementById(
        "modalOverlay"
    ).classList.remove("show");

}


/* =========================================================
   HELPERS
========================================================= */

function getBloodGroupName(donor) {

    if (!donor) {
        return "-";
    }


    if (donor.bloodGroup) {

        if (
            typeof donor.bloodGroup ===
            "object"
        ) {

            return donor.bloodGroup.name || "-";

        }

        return donor.bloodGroup;

    }


    if (donor.bloodGroupName) {

        return donor.bloodGroupName;

    }


    if (donor.bloodGroupId) {

        const group =
            bloodGroups.find(function (item) {

                return Number(item.id) ===
                    Number(donor.bloodGroupId);

            });


        return group
            ? group.name
            : "-";

    }


    return "-";

}


function getBloodGroupId(donor) {

    if (!donor) {
        return "";
    }


    if (donor.bloodGroupId) {

        return donor.bloodGroupId;

    }


    if (
        donor.bloodGroup &&
        typeof donor.bloodGroup === "object"
    ) {

        return donor.bloodGroup.id;

    }


    return "";

}


function getDonationBloodGroup(record) {

    if (
        record.bloodGroup &&
        typeof record.bloodGroup === "object"
    ) {

        return record.bloodGroup.name || "-";

    }


    if (record.bloodGroupName) {

        return record.bloodGroupName;

    }


    if (record.donor) {

        return getBloodGroupName(
            record.donor
        );

    }


    if (record.donorId) {

        const donor =
            donors.find(function (item) {

                return Number(item.id) ===
                    Number(record.donorId);

            });


        return getBloodGroupName(
            donor
        );

    }


    return "-";

}


function getDonorNameById(id) {

    const donor =
        donors.find(function (item) {

            return Number(item.id) ===
                Number(id);

        });


    return donor
        ? donor.fullName
        : "-";

}


/* =========================================================
   90 DAY ELIGIBILITY
========================================================= */

function isDonorEligible(donor) {

    if (!donor.lastDonationDate) {

        return true;

    }


    const last =
        new Date(
            donor.lastDonationDate
        );


    const today =
        new Date();


    const difference =
        today.getTime() -
        last.getTime();


    const days =
        difference /
        (1000 * 60 * 60 * 24);


    return days >= 90;

}


/* =========================================================
   DATE
========================================================= */

function formatDate(date) {

    if (!date) {

        return "-";

    }


    const parts =
        String(date).split("-");


    if (parts.length === 3) {

        return `${parts[2]} ${getMonthName(parts[1])} ${parts[0]}`;

    }


    return date;

}


function getMonthName(month) {

    const months = [

        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"

    ];


    return months[
    Number(month) - 1
        ] || "";

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function escapeAttribute(value) {

    return escapeHtml(value);

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    const text =
        document.getElementById(
            "toastMessage"
        );


    text.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(function () {

            toast.classList.remove(
                "show"
            );

        }, 2500);

}