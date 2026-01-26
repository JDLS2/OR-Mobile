
# MediaWithProgressesAndSitesDto


## Properties

Name | Type
------------ | -------------
`media` | [MediaDto](MediaDto.md)
`mediaProgresses` | [Array&lt;MediaProgressDto&gt;](MediaProgressDto.md)
`mediaSitesWithUrls` | [Array&lt;MediaSiteWithMediaUrlDto&gt;](MediaSiteWithMediaUrlDto.md)

## Example

```typescript
import type { MediaWithProgressesAndSitesDto } from ''

// TODO: Update the object below with actual values
const example = {
  "media": null,
  "mediaProgresses": null,
  "mediaSitesWithUrls": null,
} satisfies MediaWithProgressesAndSitesDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as MediaWithProgressesAndSitesDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


