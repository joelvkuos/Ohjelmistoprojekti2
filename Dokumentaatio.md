# Taulut

| App_user          | Tyyppi       |
| ------------------|--------------|
|app_user_id (PK)   | INT          |
|username           | VARCHAR(50)  |
|password           | VARCHAR(255) |
|email              | VARCHAR(100) |
|phone              | VARCHAR(20)  |

| Portfolio         | Tyyppi       |
|-------------------|--------------|
|portfolio_id (PK)  | INT          |
|app_user_id (FK)   | INT          |
|portfolio_name     | VARCHAR(100) |

| Holdings          | Tyyppi         |
|-------------------|----------------|
|holdings_id (PK)   | INT            |
|portfolio_id (FK)  | INT            |
|ticker             | VARCHAR(10)    |
|quantity           | DECIMAL(15,4)  |


## API

### API julkisiin osakkeisiin
https://finnhub.io/docs/api