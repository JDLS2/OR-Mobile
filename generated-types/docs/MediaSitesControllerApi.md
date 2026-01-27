# MediaSitesControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getMediaSites**](MediaSitesControllerApi.md#getmediasites) | **GET** /mediaSites/getMediaSites |  |
| [**updateMediaSite**](MediaSitesControllerApi.md#updatemediasite) | **POST** /mediaSites/updateMediaSite |  |



## getMediaSites

> Array&lt;MediaSiteDto&gt; getMediaSites(siteStatus)



### Example

```ts
import {
  Configuration,
  MediaSitesControllerApi,
} from '';
import type { GetMediaSitesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MediaSitesControllerApi();

  const body = {
    // string (optional)
    siteStatus: siteStatus_example,
  } satisfies GetMediaSitesRequest;

  try {
    const data = await api.getMediaSites(body);
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
| **siteStatus** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**Array&lt;MediaSiteDto&gt;**](MediaSiteDto.md)

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


## updateMediaSite

> MediaSiteDto updateMediaSite(mediaSiteDto)



### Example

```ts
import {
  Configuration,
  MediaSitesControllerApi,
} from '';
import type { UpdateMediaSiteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MediaSitesControllerApi();

  const body = {
    // MediaSiteDto
    mediaSiteDto: ...,
  } satisfies UpdateMediaSiteRequest;

  try {
    const data = await api.updateMediaSite(body);
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
| **mediaSiteDto** | [MediaSiteDto](MediaSiteDto.md) |  | |

### Return type

[**MediaSiteDto**](MediaSiteDto.md)

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

