# NotificationControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getNotifications**](NotificationControllerApi.md#getnotifications) | **GET** /notification/getNotifications |  |



## getNotifications

> UserNotificationListDto getNotifications()



### Example

```ts
import {
  Configuration,
  NotificationControllerApi,
} from '';
import type { GetNotificationsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new NotificationControllerApi();

  try {
    const data = await api.getNotifications();
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

[**UserNotificationListDto**](UserNotificationListDto.md)

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

