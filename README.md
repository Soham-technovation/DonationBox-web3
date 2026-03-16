# DonationBox Web3

Complete Web3 donation platform with Soroban smart contract, interactive frontend, and backend API.

## Components

- **Contract** (`contract/`): Soroban smart contract for on-chain donations, badges, milestones, voting
- **Frontend** (`frontend/`): Vanilla JS app with dashboard, map, leaderboard, voting
- **Backend** (`backend/`): Node.js API server with SQLite database

## Features

- Real-time impact dashboard
- NFT thank-you badges (Bronze/Silver/Hero)
- Global donor map
- Milestone unlock system
- Community voting (DAO-style)
- Donation gamification with levels

## Deployment Status

### ✅ Contract
- Built and ready for deployment
- Run: `soroban contract deploy --wasm target/wasm32v1-none/release/donationbox.wasm --source YOUR_KEY --network testnet`

### ✅ Backend
- **Status**: Deployed Locally
- **URL**: http://localhost:3000
- **Features**: API endpoints, SQLite database, CORS enabled

### ✅ Frontend
- **Status**: Deployed Locally
- **URL**: http://localhost:8000
- **Features**: Full Web3 app with Freighter integration

## Production Deployment

For production, deploy backend to Heroku/Railway and frontend to Netlify/Vercel.

```
.
├── contracts
│   └── donationbox
│       ├── src
│       │   ├── lib.rs
│       │   └── test.rs
│       └── Cargo.toml
├── Cargo.toml
└── README.md
```

## Setup

1. Ensure you have Rust and Soroban CLI installed.
2. Clone this repository.
3. Build the contract:

```bash
cargo build --release --target wasm32-unknown-unknown
```

## Deployment

To deploy the contract to a Soroban network:

1. Set up your Soroban environment.
2. Deploy using Soroban CLI:

```bash
soroban contract deploy --wasm target/wasm32-unknown-unknown/release/donationbox.wasm --source <your-source>
```

## Usage

### Initialize the Contract

Call `init(admin: Address)` to set the admin and open the box.

### Donate

Call `donate(donor: Address, amount: i128)` to donate funds.

### Withdraw

Admin calls `withdraw()` to withdraw all available funds.

### Control the Box

- `close_box()`: Close the box to stop accepting donations.
- `open_box()`: Re-open the box.

### Queries

- `total_donated()`: Total amount donated.
- `available()`: Funds available for withdrawal.
- `donor_amount(donor: Address)`: Amount donated by a specific donor.
- `donors()`: List of all donors.
- `is_open()`: Whether the box is open.
- `admin()`: Current admin address.

## Testing

Run the tests with:

```bash
cargo test
```

The test suite covers initialization, donations, and withdrawals.

## API Reference

See the contract code in `contracts/donationbox/src/lib.rs` for detailed function signatures and implementations.

## Transaction Link

[View Transaction on Stellar Expert](https://stellar.expert/explorer/testnet/tx/CCAVSF4ULWPBHD6MSOUMUGMK5SCQN3QJ76XST2UXM5LZBZYJ6YKJP7LR)

## Image Upload

To include images in the project documentation, upload them to the `images/` directory and reference them in the README or other files.

Example:

![Donation Box](donationbox-image.png)


## Contributing

Contributions are welcome. Please ensure tests pass and follow the existing code style.
