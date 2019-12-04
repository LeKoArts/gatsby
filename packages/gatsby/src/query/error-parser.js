const errorParser = ({
  message,
  filePath = undefined,
  location = undefined,
}) => {
  // Handle GraphQL errors. A list of regexes to match certain
  // errors to specific callbacks
  const handlers = [
    // Match anything with a generic catch-all error handler
    {
      regex: /[\s\S]*/gm,
      cb: match => {
        return {
          id: `85901`,
          context: { sourceMessage: match[0] },
        }
      },
    },
  ]

  let structured

  for (const { regex, cb } of handlers) {
    let matched = message.match(regex)
    if (matched) {
      structured = {
        ...(filePath && { filePath }),
        ...(location && { location }),
        ...cb(matched),
      }
      break
    }
  }

  return structured
}

export default errorParser

export const locInGraphQlToLocInFile = (
  locationOfGraphQLDocInSourceFile,
  graphqlLocation
) => {
  return {
    line:
      graphqlLocation.line + locationOfGraphQLDocInSourceFile.start.line - 1,
    column:
      (graphqlLocation.line === 1
        ? locationOfGraphQLDocInSourceFile.start.column
        : 0) + graphqlLocation.column,
  }
}
