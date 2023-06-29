# Web3Pinterest (working title)

## Start Project

Add the .env file.

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The app is optimized for smartphones, so please use a phone simulator in the browser.

## Blockchain

The smart contracts are deployed on the polygon mumbai testnet. You'll need Test MATIC: [Faucet Polygon Technology](https://faucet.polygon.technology)

## Project Structure

**src/common**: functions and types I need overall in the project

**src/components**: general and specific components

**src/contracts**: the smart contracts and build files

**src/pages**: the pages of the project

**src/theme**: customTheme for chakra UI

**src/wallet**: for the wallet connection

## Project Workflow

A quick summary of the main functions:

### Register / Login

When you start the project you can connect your wallet and you are asked to sign a message for the authentication. If you don't have an account yet, one is created.

### Home

The pins, which are created by other users, are displayed here. When you click on an image, you can save it to a board. You can also click on the account, which created the pin, and follow them and see the boards and pins of them.

### Search (work in progress)

Here will be a list of all accounts with a search function. You'll click on the profile and can follow them, see the boards and pins.

### Add

Here you can add a Pin or a Board. The Pin Image is stored with IPFS.

### Profile

Here you can see your profile with the boards and saved/created Pins. You can edit your profile (profile image, username, name, about me), and logout.

### Other Stuff

There is also some other stuff like edit/delete board, edit/delete Pin, board cover, etc.

## Work in Progress

The app is still a work in progress... I need to finish some functions and fix some bugs, please keep that in mind. :D
