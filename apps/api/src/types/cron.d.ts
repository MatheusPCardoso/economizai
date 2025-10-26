declare module 'cron' {
  export class CronJob {
    constructor(cronTime: string | Date, onTick?: (...args: any[]) => void, onComplete?: () => void, start?: boolean, timeZone?: string);
    start(): void;
    stop(): void;
  }
  export default { CronJob };
}
