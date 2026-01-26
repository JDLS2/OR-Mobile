# ProgressAnalyticsControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getProgressAnalytics**](ProgressAnalyticsControllerApi.md#getprogressanalytics) | **GET** /progressAnalytics |  |



## getProgressAnalytics

> object getProgressAnalytics(timePeriod)



### Example

```ts
import {
  Configuration,
  ProgressAnalyticsControllerApi,
} from '';
import type { GetProgressAnalyticsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ProgressAnalyticsControllerApi();

  const body = {
    // string (optional)
    timePeriod: timePeriod_example,
  } satisfies GetProgressAnalyticsRequest;

  try {
    const data = await api.getProgressAnalytics(body);
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
| **timePeriod** | `string` |  | [Optional] [Defaults to `undefined`] |

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

