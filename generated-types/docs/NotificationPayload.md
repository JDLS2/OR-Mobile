
# NotificationPayload

Payload for notification status updates via WebSocket

## Properties

Name | Type
------------ | -------------
`notificationStatus` | string
`userNotificationID` | number

## Example

```typescript
import type { NotificationPayload } from ''

// TODO: Update the object below with actual values
const example = {
  "notificationStatus": READ,
  "userNotificationID": 1,
} satisfies NotificationPayload

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as NotificationPayload
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


