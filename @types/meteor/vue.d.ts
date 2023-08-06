declare module 'meteor/rabbit:vue3' {
  import { ComputedRef } from 'vue'
  type AutorunEffect<TResult> = {
    result: ComputedRef<TResult>
    stop: () => void
  }
  type ReactiveMeteorSubscription = {
    stop: () => void
    ready: ComputedRef<boolean>
  }

  const subscribe: (name: string, ...args: any[]) => ReactiveMeteorSubscription

  const autoSubscribe: (
    callback: () => [name: string, ...args: any[]]
  ) => ReactiveMeteorSubscription

  const autoResult: <TResult = unknown>(
    callback: () => TResult
  ) => ComputedRef<TResult>

  const autorun: <TResult = unknown>(
    callback: () => TResult
  ) => AutorunEffect<TResult>

  export { subscribe, autoSubscribe, autoResult, autorun }
}
