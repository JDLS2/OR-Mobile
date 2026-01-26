
# MediaProgressDto


## Properties

Name | Type
------------ | -------------
`userId` | number
`recentChapterUrl` | string
`mediaId` | number
`chapterNumber` | string
`status` | string
`createdAt` | Date
`lastUpdatedAt` | Date

## Example

```typescript
import type { MediaProgressDto } from ''

// TODO: Update the object below with actual values
const example = {
  "userId": null,
  "recentChapterUrl": null,
  "mediaId": null,
  "chapterNumber": null,
  "status": null,
  "createdAt": null,
  "lastUpdatedAt": null,
} satisfies MediaProgressDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as MediaProgressDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


