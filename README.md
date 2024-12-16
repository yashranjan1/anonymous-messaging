# Messages

Messages is a simple feedback app that allows users to get feedback from people anonymously. It's built with Next.js, MongoDB, and Tailwind CSS.

## Features

- Anonymous feedback submission
- Verification of user accounts
- Message history
- Dark mode support
- Responsive design

## Getting Started

To get started, follow these steps:

1. Clone the repository:

```
git clone https://github.com/your-username/messages.git
```

2. Install dependencies:

```
npm install
```

3. Create a `.env` file in the root directory and add the following environment variables:

```
MONGODB_URI="{ Your MongoDB URI }"
NEXTAUTH_SECRET={ Your NextAuth secret }
RESEND_API_KEY={ Your Resend API key }
```

4. Run the development server:

```
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to access the application.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the GitHub repository.

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for more information.