const STORAGE_KEY = "codingConfTicket";
/** Read and parse the saved ticket; returns nothing if missing or broken. */
function loadTicket() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const complete = data && data.name && data.email && data.github && data.avatar && data.serial;
    return complete ? data : null;
  } catch (error) {
    return null;
  }
}

const ticket = loadTicket();

if (!ticket) {
  // no data means the form was never completed
  window.location.replace("Index.html");
} else {
  document.getElementById("out-name").textContent = ticket.name;
  document.getElementById("out-email").textContent = ticket.email;
  document.getElementById("out-fullname").textContent = ticket.name;
  document.getElementById("out-github").textContent = ticket.github;
  document.getElementById("out-serial").textContent = ticket.serial;

  const avatar = document.getElementById("out-avatar");
  avatar.src = ticket.avatar;
  avatar.alt = `Avatar of ${ticket.name}`;
}
