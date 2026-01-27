# AuthControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**adminLogin**](AuthControllerApi.md#adminlogin) | **POST** /auth/admin/login |  |
| [**login**](AuthControllerApi.md#loginoperation) | **POST** /auth/login |  |
| [**loginViaEmailLink**](AuthControllerApi.md#loginviaemaillink) | **POST** /auth/loginViaEmailLink |  |
| [**register**](AuthControllerApi.md#registeroperation) | **POST** /auth/register |  |
| [**resetPassword**](AuthControllerApi.md#resetpasswordoperation) | **POST** /auth/resetPassword |  |
| [**sendEmailLoginLink**](AuthControllerApi.md#sendemailloginlinkoperation) | **POST** /auth/sendEmailLoginLink |  |
| [**validateToken**](AuthControllerApi.md#validatetoken) | **POST** /auth/validate |  |



## adminLogin

> object adminLogin(loginRequest)



### Example

```ts
import {
  Configuration,
  AuthControllerApi,
} from '';
import type { AdminLoginRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthControllerApi();

  const body = {
    // LoginRequest
    loginRequest: ...,
  } satisfies AdminLoginRequest;

  try {
    const data = await api.adminLogin(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **loginRequest** | [LoginRequest](LoginRequest.md) |  | |

### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## login

> object login(loginRequest)



### Example

```ts
import {
  Configuration,
  AuthControllerApi,
} from '';
import type { LoginOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthControllerApi();

  const body = {
    // LoginRequest
    loginRequest: ...,
  } satisfies LoginOperationRequest;

  try {
    const data = await api.login(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **loginRequest** | [LoginRequest](LoginRequest.md) |  | |

### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## loginViaEmailLink

> object loginViaEmailLink(emailLoginRequest)



### Example

```ts
import {
  Configuration,
  AuthControllerApi,
} from '';
import type { LoginViaEmailLinkRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthControllerApi();

  const body = {
    // EmailLoginRequest
    emailLoginRequest: ...,
  } satisfies LoginViaEmailLinkRequest;

  try {
    const data = await api.loginViaEmailLink(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **emailLoginRequest** | [EmailLoginRequest](EmailLoginRequest.md) |  | |

### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## register

> object register(registerRequest)



### Example

```ts
import {
  Configuration,
  AuthControllerApi,
} from '';
import type { RegisterOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthControllerApi();

  const body = {
    // RegisterRequest
    registerRequest: ...,
  } satisfies RegisterOperationRequest;

  try {
    const data = await api.register(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **registerRequest** | [RegisterRequest](RegisterRequest.md) |  | |

### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## resetPassword

> object resetPassword(resetPasswordRequest, authorization)



### Example

```ts
import {
  Configuration,
  AuthControllerApi,
} from '';
import type { ResetPasswordOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthControllerApi();

  const body = {
    // ResetPasswordRequest
    resetPasswordRequest: ...,
    // string (optional)
    authorization: authorization_example,
  } satisfies ResetPasswordOperationRequest;

  try {
    const data = await api.resetPassword(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **resetPasswordRequest** | [ResetPasswordRequest](ResetPasswordRequest.md) |  | |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## sendEmailLoginLink

> object sendEmailLoginLink(sendEmailLoginLinkRequest)



### Example

```ts
import {
  Configuration,
  AuthControllerApi,
} from '';
import type { SendEmailLoginLinkOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthControllerApi();

  const body = {
    // SendEmailLoginLinkRequest
    sendEmailLoginLinkRequest: ...,
  } satisfies SendEmailLoginLinkOperationRequest;

  try {
    const data = await api.sendEmailLoginLink(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **sendEmailLoginLinkRequest** | [SendEmailLoginLinkRequest](SendEmailLoginLinkRequest.md) |  | |

### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## validateToken

> object validateToken(authorization)



### Example

```ts
import {
  Configuration,
  AuthControllerApi,
} from '';
import type { ValidateTokenRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthControllerApi();

  const body = {
    // string (optional)
    authorization: authorization_example,
  } satisfies ValidateTokenRequest;

  try {
    const data = await api.validateToken(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

