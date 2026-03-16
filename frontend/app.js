import { NETWORK_URL, NETWORK_PASSPHRASE } from "./config.js";

const statusEl = document.getElementById("status");
const connectBtn = document.getElementById("connectWallet");
const walletInfo = document.getElementById("walletInfo");
const publicKeyEl = document.getElementById("publicKey");
const donateSection = document.getElementById("donateSection");
const donateForm = document.getElementById("donateForm");
const donationsEl = document.getElementById("donations");

let connectedPk = null;

function setStatus(text) {
  statusEl.textContent = text;
}

function loadDonations() {
  try {
    const raw = window.localStorage.getItem("donations");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveDonations(list) {
  window.localStorage.setItem("donations", JSON.stringify(list));
}

function renderDonations() {
  const donations = loadDonations();
  if (!donations.length) {
    donationsEl.innerHTML = "<p>No donations yet.</p>";
    return;
  }
  donationsEl.innerHTML = donations
    .map(
      (d) =>
        `<div class=\"donation-card\"><strong>${d.amount} XLM</strong> — ${d.message || "(no message)"} <br/><small>${new Date(
          d.timestamp
        ).toLocaleString()}</small></div>`
    )
    .join("");
}

async function connectWallet() {
  if (!window.freighterApi) {
    setStatus("Freighter not detected. Install from https://www.freighter.app/");
    return;
  }

  try {
    if (typeof window.freighterApi.connect === "function") {
      await window.freighterApi.connect();
    }

    if (typeof window.freighterApi.isConnected === "function") {
      const connected = await window.freighterApi.isConnected();
      if (!connected) {
        setStatus("Unlock and connect your Freighter wallet first.");
        return;
      }
    }

    const pk = await window.freighterApi.getPublicKey();
    connectedPk = pk;
    publicKeyEl.textContent = pk;
    walletInfo.classList.remove("hidden");
    setStatus("Connected");
    donateSection.classList.remove("hidden");

    // Optionally fund testnet account for quick demo.
    if (NETWORK_URL.includes("testnet")) {
      try {
        await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(pk)}`);
      } catch {
        // ignore
      }
    }
  } catch (err) {
    setStatus("Wallet connection failed: " + (err.message || err));
  }
}

function init() {
  setStatus("Not connected");
  renderDonations();

  connectBtn.addEventListener("click", connectWallet);
  donateForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!connectedPk) {
      setStatus("Connect your wallet first.");
      return;
    }
    const amount = Number(document.getElementById("amount").value);
    const message = document.getElementById("amount").value ? "" : "";
    const donations = loadDonations();
    donations.push({
      amount,
      message,
      timestamp: new Date().toISOString(),
      publicKey: connectedPk,
    });
    saveDonations(donations);
    renderDonations();
    setStatus("Donation saved locally.");
    donateForm.reset();
  });
}

init();
