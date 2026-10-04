/* =========================================================
   FREIGHTPLUS TEMPORARY LEAVE REQUEST PORTAL
   PHASE 1 — FRONT END ONLY
========================================================= */

/* =========================================================
   GOOGLE APPS SCRIPT API
========================================================= */

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxj2vbOEkABtrq_83Kff1HMaDcg9jW_r-nbrg0NroWu5jTU3lmpfSad5R0FwpChLyo_/exec";

/* =========================================================
   TRUCK CONFIGURATION
========================================================= */

const TRUCKS = [
  "T13",
  "T15",
  "T16",
  "T17",
  "T20",
  "T21",
  "T31",
  "T32",
  "T33",
  "T36",
  "T38",
  "T40",
  "T41",
  "T42",
  "T45",
  "T50",
  "T51",
  "T58",
  "T65",
  "T66"
];


/* =========================================================
   DOM
========================================================= */

const leaveForm =
  document.getElementById("leaveForm");

const formPage1 =
  document.getElementById("formPage1");

const formPage2 =
  document.getElementById("formPage2");

const formPage3 =
  document.getElementById("formPage3");

const continueBtn =
  document.getElementById("continueBtn");

const backBtn =
  document.getElementById("backBtn");

const submitBtn =
  document.getElementById("submitBtn");

const submitText =
  document.getElementById("submitText");

const submitArrow =
  document.getElementById("submitArrow");

const buttonSpinner =
  document.getElementById("buttonSpinner");


/* Progress */

const progressFill =
  document.getElementById("progressFill");

const progressStep1 =
  document.getElementById("progressStep1");

const progressStep2 =
  document.getElementById("progressStep2");

const progressStep3 =
  document.getElementById("progressStep3");


/* Employee Details */

const fullName =
  document.getElementById("fullName");

const email =
  document.getElementById("email");

const department =
  document.getElementById("department");


/* Trucks */

const truckField =
  document.getElementById("truckField");

const truckSelect =
  document.getElementById("truckSelect");

const truckSelectControl =
  document.getElementById("truckSelectControl");

const truckDropdown =
  document.getElementById("truckDropdown");

const truckSearch =
  document.getElementById("truckSearch");

const truckOptions =
  document.getElementById("truckOptions");

const selectedTrucksContainer =
  document.getElementById("selectedTrucks");

const assignedTrucksInput =
  document.getElementById("assignedTrucks");

const truckError =
  document.getElementById("truckError");


/* Leave Details */

const leaveType =
  document.getElementById("leaveType");

const startDate =
  document.getElementById("startDate");

const startTime =
  document.getElementById("startTime");

const endDate =
  document.getElementById("endDate");

const endTime =
  document.getElementById("endTime");


/* File */

const supportingDocument =
  document.getElementById("supportingDocument");

const filePreview =
  document.getElementById("filePreview");

const fileName =
  document.getElementById("fileName");

const fileSize =
  document.getElementById("fileSize");

const removeFile =
  document.getElementById("removeFile");


/* General */

const formError =
  document.getElementById("formError");

const privacyNote =
  document.getElementById("privacyNote");


/* Submitted Summary */

const summaryEmployee =
  document.getElementById("summaryEmployee");

const summaryLeaveType =
  document.getElementById("summaryLeaveType");

const summaryPeriod =
  document.getElementById("summaryPeriod");

const submitAnother =
  document.getElementById("submitAnother");


/* =========================================================
   STATE
========================================================= */

let currentPage = 1;

let selectedTrucks = [];

let selectedFile = null;


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    renderTruckOptions();

    updateSelectedTrucks();

    initializeDateTimeFields();

    updateProgress();

  }
);


/* =========================================================
   TODAY
========================================================= */

function getLocalToday() {

  const now =
    new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      now.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}`;

}


/* =========================================================
   DATE / TIME INITIALIZATION
========================================================= */

function initializeDateTimeFields() {

  const today =
    getLocalToday();

  startDate.min =
    today;

  endDate.min =
    startDate.value || today;

  startTime.disabled =
    !startDate.value;

  endDate.disabled =
    !startDate.value;

  endTime.disabled =
    !endDate.value;

}


/* =========================================================
   START DATE
========================================================= */

startDate.addEventListener(
  "change",
  () => {

    clearFieldError(startDate);

    const today =
      getLocalToday();


    if (
      startDate.value &&
      startDate.value < today
    ) {

      setFieldError(
        startDate,
        "Start date cannot be in the past."
      );

      startDate.value = "";

      startTime.value = "";

      endDate.value = "";

      endTime.value = "";

      startTime.disabled = true;

      endDate.disabled = true;

      endTime.disabled = true;

      endDate.min = today;

      return;

    }


    if (!startDate.value) {

      startTime.value = "";

      endDate.value = "";

      endTime.value = "";

      startTime.disabled = true;

      endDate.disabled = true;

      endTime.disabled = true;

      endDate.min = today;

      return;

    }


    startTime.disabled = false;

    endDate.disabled = false;

    endDate.min =
      startDate.value;


    if (
      endDate.value &&
      endDate.value < startDate.value
    ) {

      endDate.value = "";

      endTime.value = "";

      endTime.disabled = true;

      clearFieldError(endDate);

      clearFieldError(endTime);

    }


    if (endDate.value) {

      endTime.disabled = false;

    }

  }
);


/* =========================================================
   START TIME
========================================================= */

startTime.addEventListener(
  "change",
  () => {

    clearFieldError(startTime);

    clearFieldError(endTime);


    if (!startDate.value) {

      startTime.value = "";

      startTime.disabled = true;

      return;

    }


    if (
      startDate.value &&
      endDate.value &&
      startDate.value === endDate.value &&
      startTime.value &&
      endTime.value &&
      endTime.value <= startTime.value
    ) {

      endTime.value = "";

      setFieldError(
        endTime,
        "End time must be later than the start time."
      );

    }

  }
);


/* =========================================================
   END DATE
========================================================= */

endDate.addEventListener(
  "change",
  () => {

    clearFieldError(endDate);

    clearFieldError(endTime);


    if (!startDate.value) {

      endDate.value = "";

      endTime.value = "";

      endDate.disabled = true;

      endTime.disabled = true;

      return;

    }


    if (!endDate.value) {

      endTime.value = "";

      endTime.disabled = true;

      return;

    }


    if (
      endDate.value < startDate.value
    ) {

      setFieldError(
        endDate,
        "End date cannot be earlier than the start date."
      );

      endDate.value = "";

      endTime.value = "";

      endTime.disabled = true;

      return;

    }


    endTime.disabled = false;


    if (
      startDate.value === endDate.value &&
      startTime.value &&
      endTime.value &&
      endTime.value <= startTime.value
    ) {

      endTime.value = "";

      setFieldError(
        endTime,
        "End time must be later than the start time."
      );

    }

  }
);


/* =========================================================
   END TIME
========================================================= */

endTime.addEventListener(
  "change",
  () => {

    clearFieldError(endTime);


    if (
      !startDate.value ||
      !endDate.value
    ) {

      endTime.value = "";

      endTime.disabled = true;

      return;

    }


    if (
      startDate.value === endDate.value &&
      startTime.value &&
      endTime.value &&
      endTime.value <= startTime.value
    ) {

      setFieldError(
        endTime,
        "End time must be later than the start time."
      );

      endTime.value = "";

    }

  }
);


/* =========================================================
   PAGE NAVIGATION
========================================================= */

continueBtn.addEventListener(
  "click",
  () => {

    if (!validatePageOne()) {
      return;
    }

    goToPage(2);

  }
);


backBtn.addEventListener(
  "click",
  () => {

    goToPage(1);

  }
);


function goToPage(page) {

  currentPage = page;


  formPage1.classList.toggle(
    "active",
    page === 1
  );

  formPage2.classList.toggle(
    "active",
    page === 2
  );

  formPage3.classList.toggle(
    "active",
    page === 3
  );


  if (privacyNote) {

    privacyNote.hidden =
      page === 3;

  }


  updateProgress();


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =========================================================
   PROGRESS
========================================================= */

function updateProgress() {

  const steps = [
    progressStep1,
    progressStep2,
    progressStep3
  ];


  steps.forEach(
    step => {

      step.classList.remove(
        "active",
        "completed"
      );

    }
  );


  /* =============================
     PAGE 1

     Nothing has been completed.
     All circles remain empty.
  ============================== */

  if (currentPage === 1) {

    progressFill.style.width =
      "0%";

    progressStep1.classList.add(
      "active"
    );

    return;

  }


  /* =============================
     PAGE 2

     Employee Details completed.

     Fill ONLY the line between
     Step 1 and Step 2.

     Step 2 remains an empty circle.
  ============================== */

  if (currentPage === 2) {

    progressFill.style.width =
      "50%";

    progressStep1.classList.add(
      "completed"
    );

    progressStep2.classList.add(
      "active"
    );

    return;

  }


  /* =============================
     PAGE 3

     Request successfully submitted.

     All steps are completed.
  ============================== */

  if (currentPage === 3) {

    progressFill.style.width =
      "100%";

    progressStep1.classList.add(
      "completed"
    );

    progressStep2.classList.add(
      "completed"
    );

    progressStep3.classList.add(
      "completed"
    );

  }

}


/* =========================================================
   DEPARTMENT / OPERATIONS
========================================================= */

department.addEventListener(
  "change",
  () => {

    clearFieldError(department);


    const isOperations =
      department.value ===
      "Operations";


    truckField.hidden =
      !isOperations;


    if (!isOperations) {

      selectedTrucks = [];

      updateSelectedTrucks();

      closeTruckDropdown();

      clearTruckError();

    }

  }
);


/* =========================================================
   TRUCK MULTI SELECT
========================================================= */

truckSelectControl.addEventListener(
  "click",
  event => {

    event.stopPropagation();


    if (
      event.target.closest(
        ".truck-chip-remove"
      )
    ) {

      return;

    }


    toggleTruckDropdown();

  }
);


function toggleTruckDropdown() {

  const opening =
    !truckSelect.classList.contains(
      "open"
    );


  truckSelect.classList.toggle(
    "open",
    opening
  );


  truckSelectControl.setAttribute(
    "aria-expanded",
    opening
      ? "true"
      : "false"
  );


  if (opening) {

    truckSearch.value = "";

    renderTruckOptions();

    setTimeout(
      () => truckSearch.focus(),
      50
    );

  }

}


function closeTruckDropdown() {

  truckSelect.classList.remove(
    "open"
  );

  truckSelectControl.setAttribute(
    "aria-expanded",
    "false"
  );

}


document.addEventListener(
  "click",
  event => {

    if (
      !truckSelect.contains(
        event.target
      )
    ) {

      closeTruckDropdown();

    }

  }
);


truckDropdown.addEventListener(
  "click",
  event => {

    event.stopPropagation();

  }
);


/* =========================================================
   TRUCK SEARCH
========================================================= */

truckSearch.addEventListener(
  "input",
  () => {

    renderTruckOptions(
      truckSearch.value
    );

  }
);


/* =========================================================
   RENDER TRUCK OPTIONS
========================================================= */

function renderTruckOptions(
  search = ""
) {

  const query =
    search
      .trim()
      .toLowerCase();


  const filtered =
    TRUCKS.filter(
      truck =>
        truck
          .toLowerCase()
          .includes(query)
    );


  truckOptions.innerHTML = "";


  if (!filtered.length) {

    truckOptions.innerHTML = `
      <div class="no-trucks">
        No trucks found
      </div>
    `;

    return;

  }


  filtered.forEach(
    truck => {

      const option =
        document.createElement(
          "button"
        );


      option.type =
        "button";

      option.className =
        "truck-option";


      if (
        selectedTrucks.includes(
          truck
        )
      ) {

        option.classList.add(
          "selected"
        );

      }


      option.innerHTML = `
        <span class="truck-checkbox"></span>
        <span>${escapeHTML(truck)}</span>
      `;


      option.addEventListener(
        "click",
        () => {

          toggleTruck(truck);

        }
      );


      truckOptions.appendChild(
        option
      );

    }
  );

}


/* =========================================================
   SELECT / UNSELECT TRUCK
========================================================= */

function toggleTruck(truck) {

  if (
    selectedTrucks.includes(
      truck
    )
  ) {

    selectedTrucks =
      selectedTrucks.filter(
        item =>
          item !== truck
      );

  } else {

    selectedTrucks.push(
      truck
    );

  }


  updateSelectedTrucks();

  renderTruckOptions(
    truckSearch.value
  );

  clearTruckError();

}


function removeTruck(truck) {

  selectedTrucks =
    selectedTrucks.filter(
      item =>
        item !== truck
    );


  updateSelectedTrucks();

  renderTruckOptions(
    truckSearch.value
  );

}


/* =========================================================
   SELECTED TRUCK CHIPS
========================================================= */

function updateSelectedTrucks() {

  selectedTrucksContainer.innerHTML =
    "";


  if (!selectedTrucks.length) {

    selectedTrucksContainer.innerHTML = `
      <span class="multi-placeholder">
        Select Assigned Truck/s
      </span>
    `;

  } else {

    selectedTrucks.forEach(
      truck => {

        const chip =
          document.createElement(
            "span"
          );


        chip.className =
          "truck-chip";


        const label =
          document.createElement(
            "span"
          );


        label.textContent =
          truck;


        const remove =
          document.createElement(
            "button"
          );


        remove.type =
          "button";

        remove.className =
          "truck-chip-remove";

        remove.setAttribute(
          "aria-label",
          `Remove ${truck}`
        );

        remove.textContent =
          "×";


        remove.addEventListener(
          "click",
          event => {

            event.stopPropagation();

            removeTruck(truck);

          }
        );


        chip.append(
          label,
          remove
        );


        selectedTrucksContainer.appendChild(
          chip
        );

      }
    );

  }


  assignedTrucksInput.value =
    selectedTrucks.join(", ");

}


/* =========================================================
   FILE UPLOAD
========================================================= */

supportingDocument.addEventListener(
  "change",
  () => {

    const file =
      supportingDocument.files[0];


    if (!file) {

      clearSelectedFile();

      return;

    }


    selectedFile =
      file;


    fileName.textContent =
      file.name;


    fileSize.textContent =
      formatFileSize(
        file.size
      );


    filePreview.hidden =
      false;

  }
);


removeFile.addEventListener(
  "click",
  () => {

    clearSelectedFile();

  }
);


function clearSelectedFile() {

  selectedFile = null;

  supportingDocument.value = "";

  filePreview.hidden = true;

  fileName.textContent = "";

  fileSize.textContent = "";

}


function formatFileSize(bytes) {

  if (bytes < 1024) {

    return `${bytes} B`;

  }


  if (
    bytes <
    1024 * 1024
  ) {

    return `${
      (
        bytes / 1024
      ).toFixed(1)
    } KB`;

  }


  return `${
    (
      bytes /
      (1024 * 1024)
    ).toFixed(1)
  } MB`;

}


/* =========================================================
   PAGE 1 VALIDATION
========================================================= */

function validatePageOne() {

  let valid = true;


  clearFieldError(fullName);

  clearFieldError(email);

  clearFieldError(department);

  clearTruckError();


  if (
    !fullName.value.trim()
  ) {

    setFieldError(
      fullName,
      "Please enter your full name."
    );

    valid = false;

  }


  if (
    !email.value.trim()
  ) {

    setFieldError(
      email,
      "Please enter your email address."
    );

    valid = false;

  } else if (
    !isValidEmail(
      email.value.trim()
    )
  ) {

    setFieldError(
      email,
      "Please enter a valid email address."
    );

    valid = false;

  }


  if (!department.value) {

    setFieldError(
      department,
      "Please select your department."
    );

    valid = false;

  }


  if (
    department.value ===
      "Operations" &&
    selectedTrucks.length === 0
  ) {

    setTruckError(
      "Please select at least one assigned truck."
    );

    valid = false;

  }


  if (!valid) {

    focusFirstError(
      formPage1
    );

  }


  return valid;

}


/* =========================================================
   PAGE 2 VALIDATION
========================================================= */

function validatePageTwo() {

  let valid = true;

  const today =
    getLocalToday();


  [
    leaveType,
    startDate,
    startTime,
    endDate,
    endTime
  ].forEach(
    clearFieldError
  );


  formError.hidden = true;


  if (!leaveType.value) {

    setFieldError(
      leaveType,
      "Please select a leave type."
    );

    valid = false;

  }


  if (!startDate.value) {

    setFieldError(
      startDate,
      "Please select a start date."
    );

    valid = false;

  } else if (
    startDate.value < today
  ) {

    setFieldError(
      startDate,
      "Start date cannot be in the past."
    );

    valid = false;

  }


  if (!startTime.value) {

    setFieldError(
      startTime,
      "Please select a start time."
    );

    valid = false;

  }


  if (!endDate.value) {

    setFieldError(
      endDate,
      "Please select an end date."
    );

    valid = false;

  } else if (
    startDate.value &&
    endDate.value < startDate.value
  ) {

    setFieldError(
      endDate,
      "End date cannot be earlier than the start date."
    );

    valid = false;

  }


  if (!endTime.value) {

    setFieldError(
      endTime,
      "Please select an end time."
    );

    valid = false;

  }


  if (
    startDate.value &&
    endDate.value &&
    startTime.value &&
    endTime.value &&
    startDate.value === endDate.value &&
    endTime.value <= startTime.value
  ) {

    setFieldError(
      endTime,
      "End time must be later than the start time."
    );

    valid = false;

  }


  if (!valid) {

    focusFirstError(
      formPage2
    );

  }


  return valid;

}


/* =========================================================
   FORM SUBMISSION
   PHASE 1 — SIMULATION
========================================================= */

leaveForm.addEventListener(
  "submit",
  async event => {

    event.preventDefault();


    /*
      Validate Step 1 again in case
      navigation is bypassed.
    */

    if (!validatePageOne()) {

      goToPage(1);

      return;

    }


    if (!validatePageTwo()) {

      return;

    }


    setSubmitting(true);


    /*
      Temporary Phase 1 submission.

      Replace this delay later with
      your actual Supabase/API request.
    */

    await delay(700);


    /*
      Populate the Step 3 summary
      BEFORE changing pages.
    */

    populateSuccessSummary();


    setSubmitting(false);


    /*
      Submission is now considered
      successful.

      Only NOW does Step 2 become
      completed and the final line fill.
    */

    goToPage(3);

  }
);

/* =========================================================
   SUBMIT LEAVE REQUEST TO GOOGLE APPS SCRIPT
========================================================= */

leaveForm.addEventListener(
  "submit",
  async event => {

    event.preventDefault();

    formError.hidden = true;
    formError.textContent = "";

    /*
     * Revalidate both pages before sending.
     */
    if (!validatePageOne()) {
      goToPage(1);
      return;
    }

    if (!validatePageTwo()) {
      goToPage(2);
      return;
    }

    /*
     * Save these before the request because
     * they are used on the success page.
     */
    const submissionData = {
      fullName:
        fullName.value.trim(),

      email:
        email.value.trim(),

      department:
        department.value,

      assignedTrucks:
        selectedTrucks.join(", "),

      leaveType:
        leaveType.value,

      startDate:
        startDate.value,

      startTime:
        startTime.value,

      endDate:
        endDate.value,

      endTime:
        endTime.value,

      reason:
        reason.value.trim(),

      supportingDocument:
        selectedFile
          ? selectedFile.name
          : ""
    };

    try {

      setSubmitting(true);

      const response =
        await fetch(
          SCRIPT_URL,
          {
            method: "POST",

            /*
             * Do not add a custom Content-Type header.
             * Sending the JSON body this way avoids
             * unnecessary CORS preflight with Apps Script.
             */
            body:
              JSON.stringify(
                submissionData
              )
          }
        );

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}.`
        );
      }

      const result =
        await response.json();

      /*
       * Apps Script may return HTTP 200 even when
       * our API reports a validation/duplicate error,
       * so check result.success too.
       */
      if (!result.success) {

        formError.textContent =
          result.message ||
          "The leave request could not be submitted.";

        formError.hidden = false;

        return;
      }

      /*
       * Submission successfully reached Google Sheets.
       */
      populateSuccessSummary();

      goToPage(3);

    } catch (error) {

      console.error(
        "Leave submission error:",
        error
      );

      formError.textContent =
        "Unable to submit your leave request. Please check your connection and try again.";

      formError.hidden = false;

    } finally {

      setSubmitting(false);

    }

  }
);
/* =========================================================
   SUBMITTING STATE
========================================================= */

function setSubmitting(submitting) {

  submitBtn.disabled =
    submitting;


  submitText.textContent =
    submitting
      ? "Submitting..."
      : "Submit Request";


  submitArrow.hidden =
    submitting;


  buttonSpinner.hidden =
    !submitting;

}


/* =========================================================
   SUCCESS SUMMARY
========================================================= */

function populateSuccessSummary() {

  summaryEmployee.textContent =
    fullName.value.trim() ||
    "—";


  summaryLeaveType.textContent =
    leaveType.value ||
    "—";


  if (
    startDate.value &&
    endDate.value
  ) {

    if (
      startDate.value ===
      endDate.value
    ) {

      summaryPeriod.textContent =
        `${formatDate(startDate.value)}, ${formatTime(startTime.value)} – ${formatTime(endTime.value)}`;

    } else {

      summaryPeriod.textContent =
        `${formatDate(startDate.value)} – ${formatDate(endDate.value)}`;

    }

  } else {

    summaryPeriod.textContent =
      "—";

  }

}


/* =========================================================
   SUBMIT ANOTHER REQUEST
========================================================= */

submitAnother.addEventListener(
  "click",
  () => {

    resetForm();

    goToPage(1);

  }
);


/* =========================================================
   RESET
========================================================= */

function resetForm() {

  leaveForm.reset();


  selectedTrucks = [];

  selectedFile = null;


  updateSelectedTrucks();


  truckField.hidden =
    true;


  clearSelectedFile();

  clearAllErrors();

  closeTruckDropdown();

  initializeDateTimeFields();


  summaryEmployee.textContent =
    "—";

  summaryLeaveType.textContent =
    "—";

  summaryPeriod.textContent =
    "—";

}


/* =========================================================
   FIELD ERROR
========================================================= */

function setFieldError(
  field,
  message
) {

  field.classList.add(
    "field-error"
  );


  const fieldContainer =
    field.closest(
      ".field"
    );


  if (!fieldContainer) {
    return;
  }


  const messageElement =
    fieldContainer.querySelector(
      ".field-error-message"
    );


  if (messageElement) {

    messageElement.textContent =
      message;

  }

}


function clearFieldError(field) {

  if (!field) {
    return;
  }


  field.classList.remove(
    "field-error"
  );


  const fieldContainer =
    field.closest(
      ".field"
    );


  if (!fieldContainer) {
    return;
  }


  const messageElement =
    fieldContainer.querySelector(
      ".field-error-message"
    );


  if (messageElement) {

    messageElement.textContent =
      "";

  }

}


/* =========================================================
   TRUCK ERROR
========================================================= */

function setTruckError(message) {

  truckSelectControl.classList.add(
    "field-error"
  );

  truckError.textContent =
    message;

}


function clearTruckError() {

  truckSelectControl.classList.remove(
    "field-error"
  );

  truckError.textContent =
    "";

}


/* =========================================================
   CLEAR ALL ERRORS
========================================================= */

function clearAllErrors() {

  document
    .querySelectorAll(
      ".field-error"
    )
    .forEach(
      field =>
        field.classList.remove(
          "field-error"
        )
    );


  document
    .querySelectorAll(
      ".field-error-message"
    )
    .forEach(
      message =>
        message.textContent = ""
    );


  formError.hidden =
    true;

}


/* =========================================================
   CLEAR ERRORS WHILE TYPING
========================================================= */

document
  .querySelectorAll(
    "input, select, textarea"
  )
  .forEach(
    field => {

      field.addEventListener(
        "input",
        () => {

          clearFieldError(
            field
          );

        }
      );


      field.addEventListener(
        "change",
        () => {

          if (
            field !== startDate &&
            field !== startTime &&
            field !== endDate &&
            field !== endTime
          ) {

            clearFieldError(
              field
            );

          }

        }
      );

    }
  );


/* =========================================================
   FOCUS FIRST ERROR
========================================================= */

function focusFirstError(container) {

  const firstError =
    container.querySelector(
      ".field-error"
    );


  if (!firstError) {
    return;
  }


  setTimeout(
    () => {

      firstError.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });


      if (
        typeof firstError.focus ===
        "function"
      ) {

        firstError.focus({
          preventScroll: true
        });

      }

    },
    50
  );

}


/* =========================================================
   EMAIL VALIDATION
========================================================= */

function isValidEmail(emailAddress) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    emailAddress
  );

}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(value) {

  const date =
    new Date(
      `${value}T00:00:00`
    );


  return new Intl.DateTimeFormat(
    "en-NZ",
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  ).format(date);

}


/* =========================================================
   TIME FORMAT
========================================================= */

function formatTime(value) {

  if (!value) {
    return "";
  }


  const [
    hours,
    minutes
  ] =
    value
      .split(":")
      .map(Number);


  const date =
    new Date();


  date.setHours(
    hours,
    minutes,
    0,
    0
  );


  return new Intl.DateTimeFormat(
    "en-NZ",
    {
      hour: "numeric",
      minute: "2-digit"
    }
  ).format(date);

}


/* =========================================================
   SAFE HTML
========================================================= */

function escapeHTML(value) {

  return String(value)

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );

}


/* =========================================================
   DELAY
========================================================= */

function delay(ms) {

  return new Promise(
    resolve =>
      setTimeout(
        resolve,
        ms
      )
  );

}