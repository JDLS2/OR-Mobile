
# MediaDto


## Properties

Name | Type
------------ | -------------
`id` | number
`title` | string
`description` | string
`imageUrl` | string
`type` | string
`status` | string
`latestChapter` | string
`createdAt` | Date
`lastUpdatedAt` | Date
`enrichedAt` | Date

## Example

```typescript
import type { MediaDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "title": null,
  "description": null,
  "imageUrl": null,
  "type": null,
  "status": null,
  "latestChapter": null,
  "createdAt": null,
  "lastUpdatedAt": null,
  "enrichedAt": null,
} satisfies MediaDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as MediaDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


