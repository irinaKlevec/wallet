import { IDebounceService } from "../../../../../shared/debounce"
import { IScheduleService } from "../../../../../shared/schedule/interface"
import { IBackgroundUIService, Opened } from "../../ui/interface"
import { pipe } from "./pipe"
import { nanoid } from "nanoid"

type Fn = (...args: unknown[]) => Promise<void>

/**
 * Function to schedule a task on startup.
 * @param {IScheduleService} scheduleService - The schedule service.
 * @returns {Function} The scheduled function.
 */
export const onStartup =
  <T extends Fn>(scheduleService: IScheduleService) =>
  (fn: T): T => {
    const id = `onStartup`
    void scheduleService.onStartup({
      id,
      callback: fn,
    })

    return fn
  }

/**
 * Function to schedule a task on install and upgrade.
 * @param {IScheduleService} scheduleService - The schedule service.
 * @returns {Function} The scheduled function.
 */
export const onInstallAndUpgrade =
  <T extends Fn>(scheduleService: IScheduleService) =>
  (fn: T): T => {
    const id = `onInstalled`
    void scheduleService.onInstallAndUpgrade({
      id,
      callback: fn,
    })

    return fn
  }

/**
 * Function to schedule a task to run every specified seconds.
 * @param {IScheduleService} scheduleService - The schedule service.
 * @param {number} seconds - The interval in seconds.
 * @returns {Function} The scheduled function.
 */
export const every =
  <T extends Fn>(scheduleService: IScheduleService, seconds: number) =>
  (fn: T): T => {
    const id = `every@${seconds}s:${nanoid()}`
    void scheduleService
      .registerImplementation({
        id,
        callback: fn,
      })
      .then(() => scheduleService.every(seconds, { id }))

    return fn
  }

export type MinimalIBackgroundUIService = Pick<
  IBackgroundUIService,
  "opened" | "emitter"
>

/**
 * Function to schedule a task to run when the UI is opened.
 * @param {IBackgroundUIService} backgroundUIService - The background UI service.
 * @returns {Function} The scheduled function.
 */
export const onOpen =
  <T extends Fn>(backgroundUIService: MinimalIBackgroundUIService) =>
  (fn: T): T => {
    backgroundUIService.emitter.on(Opened, async (open) => {
      if (open) {
        await fn()
      }
    })

    return fn
  }

function noopAs<T extends Fn>(_fn: T): T {
  const noop = () => {}
  return noop as T
}
/**
 * only run the decorated function if the UI is open
 *
 * @dev this decorator needs to go last in most cases!
 * @param backgroundUIService - the background UI service
 * @returns the decorated function
 */
export const onlyIfOpen =
  <T extends Fn>(backgroundUIService: MinimalIBackgroundUIService) =>
  (fn: T): T => {
    return ((...args: unknown[]) => {
      return backgroundUIService.opened ? fn(...args) : noopAs(fn)(...args)
    }) as T
  }

/**
 * Function to debounce a task.
 * @param {IDebounceService} debounceService - The debounce service.
 * @param {number} seconds - The debounce time in seconds.
 * @returns {Promise<void>} The debounced function.
 */
export const debounce =
  <T extends Fn>(debounceService: IDebounceService, seconds: number) =>
  (fn: T): (() => Promise<void>) => {
    const id = `debounce@${seconds}s:${nanoid()}`
    const task = { id, callback: fn, debounce: seconds }

    return () => {
      return debounceService.debounce(task)
    }
  }

/**
 * Function to schedule a task to run every specified seconds when the UI is opened.
 * @param {IBackgroundUIService} backgroundUIService - The background UI service.
 * @param {IScheduleService} scheduleService - The schedule service.
 * @param {IDebounceService} debounceService - The debounce service.
 * @param {number} seconds - The interval in seconds.
 * @returns {Function} The scheduled function.
 */
export const everyWhenOpen = (
  backgroundUIService: MinimalIBackgroundUIService,
  scheduleService: IScheduleService,
  debounceService: IDebounceService,
  seconds: number,
) => {
  return pipe(
    onOpen(backgroundUIService),
    every(scheduleService, seconds),
    onlyIfOpen(backgroundUIService),
    debounce(debounceService, seconds),
  )
}
