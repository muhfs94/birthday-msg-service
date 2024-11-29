# Birthday Message Service

## Overview

The **Birthday Message Service** is a system that sends automated birthday messages to users based on their birthday and timezone. The service ensures that users receive a message at a specific time (9:00 AM) in their local timezone on their birthday.

The service is built with TypeScript, Node.js, Prisma, and PostgreSQL, and it includes a cron job that schedules birthday messages.

---

## Features

- Automated scheduling of birthday messages for users.
- Considers user-specific timezones to send messages at the correct local time.
- Retries failed API requests with a retry strategy.
- Provides a retry mechanism for when the server is down, ensuring consistent message delivery.

---

## How to Install

### Prerequisites

- Node.js version 18 or higher
- PostgreSQL database

### 1. Clone the repository

Clone this repository to your local machine using Git:

```bash
git clone git@github.com:muhfs94/birthday-msg-service.git
cd birthday-msg-service
```

### 2. Install dependencies

Install the necessary dependencies with Yarn:

```bash
yarn install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and populate it with the following database connection details:

```plaintext
PG_USER=birthday_msg_admin
PG_PASSWORD=hbdtoyou
PG_DATABASE=birthday_msg_db
PG_HOST=localhost
PG_PORT=5432
DATABASE_URL="postgresql://birthday_msg_admin:hbdtoyou@localhost:5432/birthday_msg_db"
```

### 4. Set up the database

Run Prisma migration to set up the database schema:

```bash
yarn prisma migrate deploy
```

### 5. Populate Dummy Data

To populate the database with dummy users for testing, use the following command:

```bash
yarn populate-data
```

This will insert test users with different birthdays and timezones into the database.

### 6. Run the Service

Start the service with the following command:

```bash
yarn dev
```

This will start the service in development mode and watch for file changes.

---

## How It Works

1. **Birthday Check**: The service first checks for users whose birthdays match the current date (ignoring the year) using a query that compares only the day and month of their birthday with the current date.

2. **Timezone Handling**: Once the matching users are identified, the service adjusts the time for each user’s birthday message to 9:00 AM in their local timezone. This ensures the message is sent at the correct time regardless of where the user is located.

3. **Job Scheduling**: The service calculates the time difference between the current UTC time and the user’s local time. If the calculated time is in the future (i.e., it's still not 9:00 AM in the user’s timezone), a cron job is scheduled to send the message at the appropriate time. If the time is already passed for that day, the message is sent immediately.

4. **Retry Logic**: If the sending of the message fails due to an error (such as a failed API request), the service retries the sending operation. A retry job is scheduled in the `RetryJobs` table to keep track of the failed attempt and retry the job later.

---

## What Can Be Improved

1. **Timezones (UTC+13)**: Users in UTC+13 may face issues with message delivery, as the current implementation does not properly handle time zone edge cases, such as daylight saving time or users in extreme timezones. Consider adding more robust handling for such cases or allowing users to specify a custom time for the message delivery.
2. **Scalability**: As the number of users grows, the performance of the cron job might degrade. We could consider optimizing the cron job or breaking it into smaller tasks.
3. **Advanced Retry Strategies**: The retry logic currently retries on failure or server downtime, but we could improve it with exponential backoff for better resource management.
4. **User Interface**: Implementing a dashboard to monitor user birthdays, retry jobs, and system status would help with better management and monitoring of the system.
