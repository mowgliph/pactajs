# PACTA Web - Functional Requirements (MVP)

## 1. Dashboard Page
   a. Display key performance indicators (KPIs): total active contracts, contracts expiring soon, pending supplements, total contract value
   b. Show visual alerts for contracts expiring within 30 days
   c. Present quick statistics with charts (contracts by status, contracts by type, monthly trends)
   d. Provide quick access buttons to main modules (create contract, search, reports)

## 2. Contracts Management Page
   a. Display contracts list table with columns: contract number, title, client/supplier, start date, end date, status, amount
   b. Include advanced search bar with filters (status, date range, client, contract type, amount range)
   c. Provide action buttons per row: view details, edit, add supplement, delete
   d. Show "Create New Contract" button with form including: contract number, title, parties involved, start/end dates, amount, type, description
   e. Display contract status badges (active, expired, pending, cancelled)

## 3. Contract Details Page
   a. Show complete contract information in organized sections (general data, parties, dates, financial terms)
   b. Display associated supplements list with creation dates and descriptions
   c. Include document repository section with upload button and file list (name, type, size, upload date)
   d. Provide document preview functionality for common formats (PDF, images, Office files)
   e. Show complete audit trail/history log with timestamps, user actions, and changes made
   f. Include action buttons: edit contract, add supplement, download documents, generate report

## 4. Supplements Management Section
   a. Display supplements list linked to parent contract
   b. Show "Add Supplement" form with fields: supplement number, description, effective date, modifications, attached documents
   c. Include supplement status indicator (draft, approved, active)
   d. Provide edit and delete options for supplements
   e. Show relationship/link to parent contract

## 5. Document Repository Page
   a. Display centralized document library with all uploaded files
   b. Include bulk upload functionality with drag-and-drop support
   c. Show document metadata: filename, contract reference, upload date, file size, document type
   d. Provide search and filter options (by contract, date, document type, filename)
   e. Include document preview modal window
   f. Show download and delete options per document

## 6. Notifications Center Page
   a. Display list of automatic notifications for contract expirations (30, 15, 7 days before)
   b. Show notification status: unread/read, acknowledged
   c. Include notification settings panel to configure alert thresholds and recipients
   d. Provide mark as read/unread functionality
   e. Display notification history log

## 7. Users and Roles Management Page
   a. Display users list table with columns: name, email, role, status, last access
   b. Show "Add User" button with form: name, email, assigned role, status (active/inactive)
   c. Include roles definition section with permission matrix (admin, manager, viewer, editor)
   d. Provide edit and deactivate user options
   e. Display role-based access control settings per module
