export interface DataFilter {
  active: boolean,
  value: any,
}

export interface DataFilters {
  [key: string]: DataFilter,
}
