# Product Requirements Document: Salary Management Software

## Goal
Build a web-based employee salary management software that enables an HR Manager to efficiently manage and analyze salary data for 10,000 employees across multiple countries, replacing the current tedious Excel-based process.

## Scope & Features

### Core Features
1.  **Employee Salary Directory:** 
    *   A high-performance data table displaying 10,000 employee records (Name, Job Title, Department, Country, Salary, Currency).
    *   Support for efficient pagination or virtualization to ensure the UI remains responsive with 10k records.
    *   Ability to sort and filter employees by Name, Country, Department, and Salary range.

2.  **Analytics & Insights Dashboard:**
    *   A summary view answering key questions about how the organization pays its people.
    *   Metrics should include: Total Payroll Cost (normalized to a base currency if necessary, or grouped by currency), Average/Median Salary by Country, and Average Salary by Department.
    *   Visual distribution (e.g., bar charts) of headcount or salary expenditure across countries.

3.  **Salary Management:**
    *   Ability to view individual employee details and update their salary information.
    *   Basic validation to ensure salary data integrity.

### Technical Scope
*   **Backend:** Java REST API (e.g., Spring Boot) to serve data and analytics.
*   **Database:** PostgreSQL to store employee data.
*   **Frontend:** ReactJS application for a fast, responsive user interface.
*   **Data Seeding:** A robust seed script (SQL or Java-based) to automatically generate 10,000 realistic employee records across various countries and departments.

## Out of Scope & Reasoning

1.  **Authentication & Role-Based Access Control (RBAC):**
    *   *Reasoning:* The problem statement identifies a single persona (HR Manager) and focuses on the core problem of moving away from Excel for data management and reporting. Adding auth adds complexity without directly demonstrating the core salary management and analytics engineering problem. We will assume the app is accessed in a trusted environment for this MVP.
2.  **Payroll Processing & Tax Calculations:**
    *   *Reasoning:* The goal is *salary management* (tracking and reporting on what people are paid), not *payroll execution* (actually transferring money, calculating localized taxes, compliance). Payroll is highly complex and country-specific, pushing the scope far beyond a reasonable assessment timeframe.
3.  **Historical Salary Changes (Audit Trail):**
    *   *Reasoning:* To keep the database schema and UI simple for the initial version, we will only track the *current* salary. While a real HR system needs history, focusing on current state is sufficient to demonstrate the required analytical capabilities.
4.  **Multi-Currency Conversion Logic (Live Rates):**
    *   *Reasoning:* We will store salaries in a standard base currency (e.g., USD) or display them in their local currency without building complex live-exchange-rate conversions to keep the backend logic focused on fast querying and aggregation.

## Technical Constraints
*   Ensure the backend and database queries are optimized to aggregate data over 10k rows quickly.
*   Ensure the React frontend does not freeze when rendering large lists.
