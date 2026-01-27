# MediaProgressControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**addNewMediaProgress**](MediaProgressControllerApi.md#addnewmediaprogress) | **POST** /mediaProgresses/mediaProgress |  |
| [**deleteTrackedMedia**](MediaProgressControllerApi.md#deletetrackedmediaoperation) | **POST** /mediaProgresses/deleteTrackedMedia |  |
| [**requestMediaMerge**](MediaProgressControllerApi.md#requestmediamerge) | **POST** /mediaProgresses/requestMediaMerge |  |



## addNewMediaProgress

> MessageResponse addNewMediaProgress(addMediaProgressRequest)



### Example

```ts
import {
  Configuration,
  MediaProgressControllerApi,
} from '';
import type { AddNewMediaProgressRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MediaProgressControllerApi();

  const body = {
    // AddMediaProgressRequest
    addMediaProgressRequest: ...,
  } satisfies AddNewMediaProgressRequest;

  try {
    const data = await api.addNewMediaProgress(body);
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
| **addMediaProgressRequest** | [AddMediaProgressRequest](AddMediaProgressRequest.md) |  | |

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


## deleteTrackedMedia

> MessageResponse deleteTrackedMedia(deleteTrackedMediaRequest)



### Example

```ts
import {
  Configuration,
  MediaProgressControllerApi,
} from '';
import type { DeleteTrackedMediaOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MediaProgressControllerApi();

  const body = {
    // DeleteTrackedMediaRequest
    deleteTrackedMediaRequest: ...,
  } satisfies DeleteTrackedMediaOperationRequest;

  try {
    const data = await api.deleteTrackedMedia(body);
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
| **deleteTrackedMediaRequest** | [DeleteTrackedMediaRequest](DeleteTrackedMediaRequest.md) |  | |

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


## requestMediaMerge

> MessageResponse requestMediaMerge(mediaMergeRequest)



### Example

```ts
import {
  Configuration,
  MediaProgressControllerApi,
} from '';
import type { RequestMediaMergeRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MediaProgressControllerApi();

  const body = {
    // MediaMergeRequest
    mediaMergeRequest: ...,
  } satisfies RequestMediaMergeRequest;

  try {
    const data = await api.requestMediaMerge(body);
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
| **mediaMergeRequest** | [MediaMergeRequest](MediaMergeRequest.md) |  | |

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

