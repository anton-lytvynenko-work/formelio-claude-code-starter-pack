# Mermaid Diagram Templates

Copy-paste templates for common diagram types.

## Architecture

```mermaid
graph TB
    subgraph Client
        UI[Web App]
        Mobile[Mobile App]
    end
    subgraph API
        Gateway[API Gateway]
        Auth[Auth Service]
        Core[Core Service]
    end
    subgraph Data
        DB[(Database)]
        Cache[(Redis)]
    end
    UI --> Gateway
    Mobile --> Gateway
    Gateway --> Auth
    Gateway --> Core
    Core --> DB
    Core --> Cache
```

## Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant A as API
    participant D as Database
    U->>C: Click Login
    C->>A: POST /auth/login
    A->>D: Query user
    D-->>A: User data
    A-->>C: JWT token
    C-->>U: Redirect to dashboard
```

## State Machine

```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Pending: Submit
    Pending --> Approved: Approve
    Pending --> Rejected: Reject
    Rejected --> Draft: Revise
    Approved --> Published: Publish
    Published --> [*]
```

## ERD

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    USER { int id PK; string email; string name }
    ORDER ||--|{ ORDER_ITEM : contains
    ORDER { int id PK; int user_id FK; string status }
    ORDER_ITEM { int id PK; int order_id FK; int quantity }
    PRODUCT ||--o{ ORDER_ITEM : "ordered in"
    PRODUCT { int id PK; string name; decimal price }
```

## Flowchart

```mermaid
flowchart TD
    A[Start] --> B{Condition?}
    B -->|Yes| C[Action]
    B -->|No| D[Other]
    C --> E[End]
    D --> E
```

## Class

```mermaid
classDiagram
    class User {
        +int id
        +string email
        +login()
    }
    class Order {
        +int id
        +calculateTotal()
    }
    User "1" --> "*" Order : places
```
