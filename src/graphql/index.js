/* eslint-disable no-undef */
import { getOperationName } from '../utils/utils'

/**
 * Send GraphQL request.
 *
 * @param networkConfig - Selected network config.
 * @param query - GraphQL query.
 * @param variables - GraphQL variables.
 */
export async function gql(url, query, variables = {}) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        query,
        operationName: getOperationName(query),
        variables
      })
    })

    const { data, errors } = await response.json()
    if (errors) throw new Error(errors[0].message)

    return data
  } catch (err) {
    console.error('src/graphql/index.ts:30', err.message)
    throw err
  }
}
