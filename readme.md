## Vepler Core HTTP Wrapper
A flexible and extensible API service library for making HTTP requests with built-in authentication support for bearer tokens and API keys.

### Installation
```bash
npm install @vepler/http-client
```

### Usage
```typescript
import ApiService from '@vepler/http-client';

// Create an instance of the API service
const api = ApiService.create({
  host: 'https://api.example.com',
  timeout: 5000,
  logLevel: 'info',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Make a GET request
const response = await api.get('users', '123', {
  token: 'your-bearer-token',
  apiKey: 'your-api-key',
});

// Make a POST request
const newUser = await api.post('users', {
  name: 'John Doe',
  email: 'john@example.com',
}, {
  token: 'your-bearer-token',
  apiKey: 'your-api-key',
});

// Make a PUT request
const updatedUser = await api.put('users/123', {
  name: 'John Doe',
  email: 'john.doe@example.com',
}, {
  token: 'your-bearer-token',
  apiKey: 'your-api-key',
});

// Make a DELETE request
await api.delete('users', '123', {
  token: 'your-bearer-token',
  apiKey: 'your-api-key',
});
```

### Configuration
The create method of the ApiService accepts an options object with the following properties:
- host (required): The base URL of the API.
- timeout (optional): The request timeout in milliseconds. Default is 3000.
- logLevel (optional): The log level for the API service. Default is 'info'.
- headers (optional): Additional headers to be included in all requests.

### Authentication
The API service supports authentication using bearer tokens and API keys. You can pass the token and apiKey properties as part of the queryParams object when making requests.

- token: The bearer token for authentication.
- apiKey: The API key for authentication.

### Interceptors
The API service includes built-in request and response interceptors for logging and error handling. You can customize or extend these interceptors by modifying the logRequest, interceptorResponseSuccess, and interceptorResponseError functions.

### Error Handling
The API service includes error handling in case of network errors or invalid responses. Errors are thrown with a descriptive error message, which can be caught and handled in your application code.

### License
This project is licensed under the MIT License.
