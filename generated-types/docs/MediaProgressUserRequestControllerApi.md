# MediaProgressUserRequestControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getMediaProgressUserRequests**](MediaProgressUserRequestControllerApi.md#getmediaprogressuserrequests) | **GET** /mediaProgressUserRequests |  |
| [**retryProgressRequests**](MediaProgressUserRequestControllerApi.md#retryprogressrequests) | **POST** /mediaProgressUserRequests/retryProgressRequests |  |



## getMediaProgressUserRequests

> object getMediaProgressUserRequests()



### Example

```ts
import {
  Configuration,
  MediaProgressUserRequestControllerApi,
} from '';
import type { GetMediaProgressUserRequestsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MediaProgressUserRequestControllerApi();

  try {
    const data = await api.getMediaProgressUserRequests();
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


## retryProgressRequests

> { [key: string]: string; } retryProgressRequests()



### Example

```ts
import {
  Configuration,
  MediaProgressUserRequestControllerApi,
} from '';
import type { RetryProgressRequestsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MediaProgressUserRequestControllerApi();

  try {
    const data = await api.retryProgressRequests();
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

**{ [key: string]: string; }**

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

