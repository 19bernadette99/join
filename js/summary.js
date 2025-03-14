/**
 * This function updates the greeting message based on the current time of day.
 * It displays "Good morning", "Good afternoon", or "Good evening" 
 * depending on the hour and updates the content of the greeting element.
 */
function updateGreeting() {
    // This function selects the greeting paragraph element
    const greetingElement = document.querySelector(".greeting p");

    // This function gets the current hour (0-23)
    const currentHour = new Date().getHours();

    // Default greeting message
    let greetingText = "Good morning";

    // Adjust the greeting based on the time of day
    if (currentHour >= 12 && currentHour < 18) {
        greetingText = "Good afternoon";
    } else if (currentHour >= 18 || currentHour < 5) {
        greetingText = "Good evening";
    }

    // Get the user name from localStorage or use "Guest"
    const isGuest = localStorage.getItem("isGuest") === "true";
    const userName = isGuest ? "Guest" : "Sofia Müller";

    // Update the greeting message in the DOM
    greetingElement.innerHTML = `${greetingText}, <br> <span class='highlight'>${userName}</span>`;
}

/**
 * This function counts the tasks and updates the task metrics.
 */
function updateTaskMetrics() {
    const todoCount = document.querySelectorAll(".to-do-wrapper .board-card").length;
    const inProgressCount = document.querySelectorAll(".in-progress-wrapper .board-card").length;
    const awaitFeedbackCount = document.querySelectorAll(".await-feedback-wrapper .board-card").length;
    const doneCount = document.querySelectorAll(".done-wrapper .board-card").length;
    const totalCount = todoCount + inProgressCount + awaitFeedbackCount + doneCount;

    document.querySelector(".metrics .metric-box:nth-of-type(1) h2").textContent = todoCount;
    document.querySelector(".metrics .metric-box:nth-of-type(2) h2").textContent = doneCount;
    document.querySelector(".wrapper_tasks .metric-box-tasks:nth-of-type(1) h2").textContent = totalCount;
    document.querySelector(".wrapper_tasks .metric-box-tasks:nth-of-type(2) h2").textContent = inProgressCount;
    document.querySelector(".wrapper_tasks .metric-box-tasks:nth-of-type(3) h2").textContent = awaitFeedbackCount;
}

/**
 * This function updates the user profile icon and initials in the summary.
 * It sets the profile initials to "G" for guests and "SM" for logged-in users.
 */
function updateUserProfile() {
    const userProfile = document.querySelector(".user-profile span");

    // Check if the user is logged in as a guest
    const isGuest = localStorage.getItem("isGuest") === "true";

    // Set profile initials
    const profileInitials = isGuest ? "G" : "SM";

    // Update the profile icon text
    userProfile.textContent = profileInitials;
}

// Call the functions when the page loads
updateGreeting();
updateTaskMetrics();
updateUserProfile();
