# UserControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**addNewUser**](UserControllerApi.md#addnewuser) | **POST** /users/user |  |
| [**getUsers**](UserControllerApi.md#getusers) | **GET** /users |  |



## addNewUser

> string addNewUser(addUserRequest)



### Example

```ts
import {
  Configuration,
  UserControllerApi,
} from '';
import type { AddNewUserRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UserControllerApi();

  const body = {
    // AddUserRequest
    addUserRequest: ...,
  } satisfies AddNewUserRequest;

  try {
    const data = await api.addNewUser(body);
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
| **addUserRequest** | [AddUserRequest](AddUserRequest.md) |  | |

### Return type

**string**

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


## getUsers

> Array&lt;UserDto&gt; getUsers()



### Example

```ts
import {
  Configuration,
  UserControllerApi,
} from '';
import type { GetUsersRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UserControllerApi();

  try {
    const data = await api.getUsers();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;UserDto&gt;**](UserDto.md)

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

