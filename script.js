const header = document.querySelector("[data-header]");
const revealItems = document.querySelectorAll(".reveal");
const form = document.querySelector("[data-quote-form]");
const summary = document.querySelector("[data-request-summary]");

const onScroll = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 10);
};

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => observer.observe(item));

function formValue(data, name) {
  return String(data.get(name) || "").trim();
}

function selectedServices() {
  return [...form.querySelectorAll("input[name='services']:checked")].map((item) => item.value);
}

function buildRequest(data) {
  const services = selectedServices();
  return [
    "KING REGGAELATION ENT. Event Request",
    "Send to: kingreggaelation@yahoo.com",
    "",
    `Name: ${formValue(data, "name")}`,
    `Phone: ${formValue(data, "phone")}`,
    `Event type: ${formValue(data, "eventType")}`,
    `Event date: ${formValue(data, "date")}`,
    `Time: ${formValue(data, "time")}`,
    `Audience size: ${formValue(data, "headcount") || "Not provided"}`,
    `Venue / setting: ${formValue(data, "venue") || "Not provided"}`,
    `Coverage areas: ${formValue(data, "zones")}`,
    `Services needed: ${services.length ? services.join(", ") : "Not selected"}`,
    "",
    "Notes:",
    formValue(data, "notes") || "None provided",
  ].join("\n");
}

if (form && summary) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const requestText = buildRequest(new FormData(form));
    summary.innerHTML = `
      <h3>Request summary</h3>
      <pre>${requestText.replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[char]))}</pre>
      <button class="copy-summary" type="button">Copy summary</button>
    `;

    const button = summary.querySelector("button");
    button.addEventListener("click", async () => {
      await navigator.clipboard.writeText(requestText);
      button.textContent = "Copied";
      setTimeout(() => {
        button.textContent = "Copy summary";
      }, 1600);
    });
  });
}
