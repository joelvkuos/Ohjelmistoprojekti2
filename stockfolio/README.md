# Stockfolio API Documentation

Stockfolio on osakeportfolioiden hallintasovellus.

---

## User API

### Endpointit
- `/api/users`
- `/api/users/{id}`

### Metodit ja parametrit
| Metodi | Polku | Polkuparametrit | Kuvaus |
|--------|-------|-----------------|--------|
| GET | /api/users | – | Hakee kaikki käyttäjät |
| GET | /api/users/{id} | {id}=1 | Hakee käyttäjän id:llä |
| POST | /api/users | – | Luo uuden käyttäjän |
| DELETE | /api/users/{id} | {id}=1 | Poistaa käyttäjän |

### Esimerkkituloste
```json
{
  "app_user_id": 1,
  "userName": "john_doe",
  "email": "john@example.com",
  "phone": "0401234567"
}
```

---

## Portfolio API

### Endpointit
- `/api/portfolio`
- `/api/portfolio/{id}`
- `/api/portfolio/user/{userId}`

### Metodit ja parametrit
| Metodi | Polku | Polkuparametrit | Kuvaus |
|--------|-------|-----------------|--------|
| GET | /api/portfolio | – | Hakee kaikki portfoliot |
| GET | /api/portfolio/{id} | {id}=1 | Hakee portfolion id:llä |
| GET | /api/portfolio/user/{userId} | {userId}=1 | Hakee käyttäjän portfoliot |
| POST | /api/portfolio | – | Luo uuden portfolion |
| DELETE | /api/portfolio/{id} | {id}=1 | Poistaa portfolion |

### Esimerkkituloste
```json
{
  "portfolio_id": 1,
  "app_user_id": 1,
  "portfolio_name": "My Portfolio"
}
```

---

## Holdings API

### Endpointit
- `/api/holdings`
- `/api/holdings/{id}`
- `/api/holdings/portfolio/{portfolioId}`
- `/api/holdings/ticker/{ticker}`

### Metodit ja parametrit
| Metodi | Polku | Polkuparametrit | Kuvaus |
|--------|-------|-----------------|--------|
| GET | /api/holdings | – | Hakee kaikki omistukset |
| GET | /api/holdings/{id} | {id}=1 | Hakee omistuksen id:llä |
| GET | /api/holdings/portfolio/{portfolioId} | {portfolioId}=1 | Hakee portfolion omistukset |
| GET | /api/holdings/ticker/{ticker} | {ticker}=AAPL | Hakee omistukset tickerillä |
| POST | /api/holdings | – | Luo uuden omistuksen |
| DELETE | /api/holdings/{id} | {id}=1 | Poistaa omistuksen |

### Esimerkkituloste
```json
{
  "holdings_id": 1,
  "portfolio_id": 1,
  "ticker": "AAPL",
  "quantity": 10.0
}
```

---

## HTTP-statuskoodit
| Koodi | Kuvaus |
|-------|--------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 404 | Not Found |
