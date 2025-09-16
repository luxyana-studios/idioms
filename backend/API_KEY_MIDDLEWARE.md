# API Key Authentication Middleware

This middleware verifies the presence of an API key in requests and validates it against the users table.

## How it works

1. **Registration**: Users register via `/users/register` (exempt from API key requirement)
2. **API Key Generation**: Backend generates a unique API key for each user
3. **Authentication**: All other endpoints require a valid API key in headers
4. **Validation**: Middleware checks API key against the users table

## Headers Supported

The middleware accepts API keys in the `x-api-key` header.

## Exempt Paths

These paths don't require API key authentication:

- `/` (status endpoint)
- `/docs` (API documentation)
- `/openapi.json`
- `/redoc`
- `/users/register`

## Usage in Endpoints

```python
from app.middleware import get_current_user
from app.models.users import UserModel

# Add to your endpoint
async def my_endpoint(current_user: Annotated[UserModel, Depends(get_current_user)]):
    # current_user is now available with user info
    print(f"Request from user: {current_user.id}")
```

## Frontend Integration

The frontend automatically:

1. Registers users on first launch
2. Stores API keys in secure storage
3. Includes API key in all requests

## Error Responses

### Unauthorized (401)

For security reasons, all authentication failures return the same generic response:

```json
{
  "detail": "Unauthorized"
}
```

This applies to both missing and invalid API keys to avoid revealing authentication method details to potential attackers.

## Testing

```bash
# Test without API key (should fail)
curl http://localhost:8000/idioms/categories

# Test with invalid API key (should fail)
curl -H "x-api-key: invalid-key" http://localhost:8000/idioms/categories

# Register user and get API key
curl -X POST http://localhost:8000/users/register \
  -H "Content-Type: application/json" \
  -d '{"installation_id": "test-123"}'

# Use returned API key
curl -H "x-api-key: YOUR_API_KEY" http://localhost:8000/idioms/categories
```

## Implementation Details

- Uses SQLAlchemy session for database queries
- Adds user info to `request.state` for endpoint access
- Minimal performance impact (single DB query per request)
- Secure API key validation against database
