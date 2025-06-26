# API Documentation

## Authentication

### Register
`POST /api/trpc/auth.register`

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### Sign In
Use NextAuth.js `/api/auth/signin` endpoint with credentials.

## Secrets

### Create Secret
`POST /api/trpc/secret.create`

```json
{
  "content": "My secret message",
  "password": "optional-password",
  "oneTimeAccess": true,
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

Returns: `{ id: "secret-id" }`

### View Secret
`GET /secret/{id}`

Public endpoint. Marks secret as viewed if `oneTimeAccess` is true.

### Get My Secrets
`GET /api/trpc/secret.getMySecrets`

Query params:
- `search`: Filter by content
- `limit`: Number of results (default: 10)
- `offset`: Pagination offset

### Update Secret
`POST /api/trpc/secret.update`

```json
{
  "id": "secret-id",
  "content": "Updated content",
  "oneTimeAccess": false,
  "expiresAt": null,
  "password": "new-password"
}
```

Only works for unviewed secrets.

### Delete Secret
`POST /api/trpc/secret.delete`

```json
{
  "id": "secret-id"
}
```

### Get Stats
`GET /api/trpc/secret.getMyStats`

Returns counts of active, viewed, and expired secrets.

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Not authenticated"
  }
}
```

Common error codes:
- `UNAUTHORIZED`: Not logged in
- `FORBIDDEN`: No permission
- `NOT_FOUND`: Resource doesn't exist
- `CONFLICT`: Resource already exists
- `BAD_REQUEST`: Invalid input
