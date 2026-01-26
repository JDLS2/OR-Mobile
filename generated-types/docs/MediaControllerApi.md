# MediaControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getMedia**](MediaControllerApi.md#getmedia) | **GET** /medias |  |
| [**getMediaWithAllProgresses**](MediaControllerApi.md#getmediawithallprogresses) | **GET** /medias/{mediaId} |  |
| [**getMyRecentMedia**](MediaControllerApi.md#getmyrecentmedia) | **GET** /medias/recent |  |



## getMedia

> Array&lt;MediaDto&gt; getMedia()



### Example

```ts
import {
  Configuration,
  MediaControllerApi,
} from '';
import type { GetMediaRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MediaControllerApi();

  try {
    const data = await api.getMedia();
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

[**Array&lt;MediaDto&gt;**](MediaDto.md)

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


## getMediaWithAllProgresses

> MediaWithProgressesAndSitesDto getMediaWithAllProgresses(mediaId)



### Example

```ts
import {
  Configuration,
  MediaControllerApi,
} from '';
import type { GetMediaWithAllProgressesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MediaControllerApi();

  const body = {
    // number
    mediaId: 56,
  } satisfies GetMediaWithAllProgressesRequest;

  try {
    const data = await api.getMediaWithAllProgresses(body);
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
| **mediaId** | `number` |  | [Defaults to `undefined`] |

### Return type

[**MediaWithProgressesAndSitesDto**](MediaWithProgressesAndSitesDto.md)

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


## getMyRecentMedia

> Array&lt;MediaWithProgressDto&gt; getMyRecentMedia()



### Example

```ts
import {
  Configuration,
  MediaControllerApi,
} from '';
import type { GetMyRecentMediaRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MediaControllerApi();

  try {
    const data = await api.getMyRecentMedia();
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

[**Array&lt;MediaWithProgressDto&gt;**](MediaWithProgressDto.md)

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

