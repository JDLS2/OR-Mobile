
# UserNotificationDto

Represents a user notification

## Properties

Name | Type
------------ | -------------
`id` | number
`userId` | number
`message` | string
`type` | string
`status` | string
`result` | string
`createdAt` | Date

## Example

```typescript
import type { UserNotificationDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": 1,
  "userId": 42,
  "message": Progress upload for manga-url succeeded,
  "type": PROGRESS_UPLOAD_SUCCESS,
  "status": UNREAD,
  "result": SUCCESS,
  "createdAt": null,
} satisfies UserNotificationDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UserNotificationDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


