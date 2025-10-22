export enum State {
  enabled = 0,
  disabled = 1,
}

export interface Banner {
  id: number
  name: string
  img: string
  url: string
  target: string
  disabled: State
}