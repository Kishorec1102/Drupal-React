export type JsonApiCollection<T> = {
  data: T[]
}

export type DrupalResource<
  TAttributes,
  TRelationships = Record<string, never>,
> = {
  id: string
  attributes: TAttributes
  relationships?: TRelationships
}

export type ResourceIdentifier = {
  type: string
  id: string
  meta?: {
    drupal_internal__target_id?: number | string
  }
}
