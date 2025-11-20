# MongoDB to MariaDB Migration Plan

## 1. Dependencies

**Remove:**
- `mongoose`

**Add:**
- `typeorm`
- `mysql2`
- `reflect-metadata`

## 2. Database Schema Design (MariaDB)

We will use TypeORM entities to define the schema.

### Users Table (`users`)
| Column | Type | Notes |
| :--- | :--- | :--- |
| id | UUID | Primary Key |
| email | VARCHAR | Unique |
| password | VARCHAR | |
| name | VARCHAR | |
| role | ENUM | 'admin', 'user' |
| expiration_warning_days | INT | Default 30 |
| enable_browser_notifications | BOOLEAN | Default true |
| enable_email_notifications | BOOLEAN | Default false |
| created_at | DATETIME | |
| updated_at | DATETIME | |

### Push Subscriptions Table (`push_subscriptions`)
| Column | Type | Notes |
| :--- | :--- | :--- |
| id | UUID | Primary Key |
| user_id | UUID | Foreign Key -> users.id |
| endpoint | TEXT | |
| p256dh | TEXT | |
| auth | TEXT | |

### Contracts Table (`contracts`)
| Column | Type | Notes |
| :--- | :--- | :--- |
| id | UUID | Primary Key |
| title | VARCHAR | |
| object | TEXT | |
| start_date | DATETIME | |
| end_date | DATETIME | |
| amount | DECIMAL | |
| status | ENUM | 'active', 'expired', 'terminated' |
| type | ENUM | 'service', 'sales', 'lease', 'other' |
| created_by | UUID | Foreign Key -> users.id |
| parties | JSON | Array of strings (simplest for now) |
| created_at | DATETIME | |
| updated_at | DATETIME | |

### Contract History Table (`contract_history`)
| Column | Type | Notes |
| :--- | :--- | :--- |
| id | UUID | Primary Key |
| contract_id | UUID | Foreign Key -> contracts.id |
| date | DATETIME | |
| action | VARCHAR | |
| details | TEXT | |

### Contract Supplements Table (`contract_supplements`)
| Column | Type | Notes |
| :--- | :--- | :--- |
| id | UUID | Primary Key |
| contract_id | UUID | Foreign Key -> contracts.id |
| supplement_ref_id | VARCHAR | Original ID string from Mongo if needed, or just use UUID |
| effective_date | DATETIME | |
| reason | TEXT | |
| created_at | DATETIME | |
| modified_fields | JSON | Storing complex object array as JSON |

### Contract Documents Table (`contract_documents`)
| Column | Type | Notes |
| :--- | :--- | :--- |
| id | UUID | Primary Key |
| contract_id | UUID | Foreign Key -> contracts.id |
| document_ref_id | VARCHAR | |
| filename | VARCHAR | |
| original_name | VARCHAR | |
| path | VARCHAR | |
| size | INT | |
| mime_type | VARCHAR | |
| uploaded_at | DATETIME | |

### Notifications Table (`notifications`)
| Column | Type | Notes |
| :--- | :--- | :--- |
| id | UUID | Primary Key |
| user_id | UUID | Foreign Key -> users.id |
| contract_id | UUID | Foreign Key -> contracts.id |
| type | ENUM | 'expiration_warning', etc. |
| title | VARCHAR | |
| message | TEXT | |
| read | BOOLEAN | Default false |
| created_at | DATETIME | |
| updated_at | DATETIME | |

## 3. Migration Steps

### Step 1: Install Dependencies
```bash
npm uninstall mongoose
npm install typeorm mysql2 reflect-metadata
npm install --save-dev @types/node
```

### Step 2: Configuration
Create `backend/src/data-source.ts` to configure the MariaDB connection.

### Step 3: Create Entities
Create the following files in `backend/src/entities/`:
- `User.ts`
- `PushSubscription.ts`
- `Contract.ts`
- `ContractHistory.ts`
- `ContractSupplement.ts`
- `ContractDocument.ts`
- `Notification.ts`

### Step 4: Update Application Logic
1.  **Server Setup:** Update `backend/src/server.ts` to initialize the TypeORM DataSource instead of Mongoose.
2.  **Repositories/Services:**
    - Refactor `backend/src/controllers/` to use TypeORM repositories.
    - Since the logic is currently in controllers, we might want to introduce a service layer or just use repositories directly in controllers.
    - **Key Changes:**
        - `User.findOne(...)` -> `userRepository.findOneBy(...)`
        - `new User(...)` -> `userRepository.create(...)` & `userRepository.save(...)`
        - `Contract.find(...)` -> `contractRepository.find(...)`
3.  **Middleware:** Update `auth.ts` to fetch user using TypeORM.

### Step 5: Data Migration (Optional/If needed)
If there is existing production data, a script will be needed to read from Mongo and insert into MariaDB. For this task, we assume we are setting up the structure for the switch.

## 4. Files to Modify/Create

- **Modify:**
    - `backend/package.json`
    - `backend/src/server.ts`
    - `backend/src/middleware/auth.ts`
    - `backend/src/controllers/*.ts` (All controllers need updates)
    - `backend/src/scheduler.ts` (Update notification logic)
- **Create:**
    - `backend/src/data-source.ts`
    - `backend/src/entities/*.ts`
- **Delete:**
    - `backend/src/models/*.ts` (After migration is verified)
