# UserSubmissionControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**addUserSubmission**](UserSubmissionControllerApi.md#addusersubmissionoperation) | **POST** /userSubmission/addUserSubmission |  |
| [**getMyUserSubmissions**](UserSubmissionControllerApi.md#getmyusersubmissions) | **GET** /userSubmission/getMyUserSubmissions |  |
| [**getUserSubmissions**](UserSubmissionControllerApi.md#getusersubmissions) | **GET** /userSubmission/getUserSubmissions |  |



## addUserSubmission

> MessageResponse addUserSubmission(addUserSubmissionRequest)



### Example

```ts
import {
  Configuration,
  UserSubmissionControllerApi,
} from '';
import type { AddUserSubmissionOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UserSubmissionControllerApi();

  const body = {
    // AddUserSubmissionRequest
    addUserSubmissionRequest: ...,
  } satisfies AddUserSubmissionOperationRequest;

  try {
    const data = await api.addUserSubmission(body);
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
| **addUserSubmissionRequest** | [AddUserSubmissionRequest](AddUserSubmissionRequest.md) |  | |

### Return type

[**MessageResponse**](MessageResponse.md)

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


## getMyUserSubmissions

> object getMyUserSubmissions()



### Example

```ts
import {
  Configuration,
  UserSubmissionControllerApi,
} from '';
import type { GetMyUserSubmissionsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UserSubmissionControllerApi();

  try {
    const data = await api.getMyUserSubmissions();
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


## getUserSubmissions

> object getUserSubmissions()



### Example

```ts
import {
  Configuration,
  UserSubmissionControllerApi,
} from '';
import type { GetUserSubmissionsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UserSubmissionControllerApi();

  try {
    const data = await api.getUserSubmissions();
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

