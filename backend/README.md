# DonationBox Backend

Node.js/Express API server for DonationBox Web3 app.

## Features

- RESTful API for profiles, donations, locations, leaderboard
- SQLite database for persistent storage
- CORS enabled for frontend integration

## Setup

1. `npm install`
2. `npm start`

Server runs on http://localhost:3000

## API Endpoints

- `GET /api/profiles` - Get all profiles
- `POST /api/profiles` - Create/update profile
- `GET /api/profiles/:publicKey` - Get profile by key
- `GET /api/donations` - Get all donations
- `POST /api/donations` - Create donation
- `GET /api/locations` - Get locations
- `POST /api/locations` - Update location amounts
- `GET /api/leaderboard` - Get top donors
