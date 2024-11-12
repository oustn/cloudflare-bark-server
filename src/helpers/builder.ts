export enum EInterruptionLevel {
  Passive = "passive",
  Active = "active",
  TimeSensitive = "time-sensitive",
  Critical = "critical"
}

interface Aps {
  alert?: Alert;
  badge?: number;
  category?: string;
  "content-available"?: number;
  "interruption-level"?: EInterruptionLevel;
  "mutable-content"?: number;
  "relevance-score"?: number;
  sound?: Sound;
  "thread-id"?: string;
  "url-args"?: string[];
}

interface Alert {
  action?: string;
  "action-loc-key"?: string;
  body?: string;
  "launch-image"?: string;
  "loc-args"?: string[];
  "loc-key"?: string;
  title?: string;
  subtitle?: string;
  "title-loc-args"?: string[];
  "title-loc-key"?: string;
  "summary-arg"?: string;
  "summary-arg-count"?: number;
}

export interface Sound {
  critical?: number;
  name?: string;
  volume?: number;
}

export class Payload {
  private readonly content: {
    aps: Aps;
    [key: string]: unknown,
    data: { [key: string]: unknown }
  };

  constructor() {
    this.content = {aps: {}, data: {}};
  }

  alert(alert: Alert) {
    this.aps().alert = alert;
    return this
  }

  badge(badge: number) {
    this.aps().badge = badge;
    return this
  }

  zeroBadge() {
    this.aps().badge = 0;
    return this
  }

  unsetBadge() {
    delete this.aps().badge;
    return this
  }

  sound(sound: Sound) {
    this.aps().sound = sound;
    return this
  }

  contentAvailable() {
    this.aps()["content-available"] = 1;
    return this
  }

  mutableContent() {
    this.aps()["mutable-content"] = 1;
    return this
  }

  custom(key: string, value: unknown) {
    this.content.data[key] = value;
    return this
  }

  alertTitle(title: string) {
    this.apsAlert().title = title;
    return this
  }

  alertTitleLocKey(locKey: string) {
    this.apsAlert()["title-loc-key"] = locKey;
    return this
  }

  alertTitleLocArgs(locArgs: string[]) {
    this.apsAlert()["title-loc-args"] = locArgs;
    return this
  }

  alertSubtitle(subtitle: string) {
    this.apsAlert().subtitle = subtitle;
    return this
  }

  alertBody(body: string) {
    this.apsAlert().body = body;
    return this
  }

  alertLaunchImage(launchImage: string) {
    this.apsAlert()["launch-image"] = launchImage;
    return this
  }

  alertLocKey(locKey: string) {
    this.apsAlert()["loc-key"] = locKey;
    return this
  }

  alertLocArgs(locArgs: string[]) {
    this.apsAlert()["loc-args"] = locArgs;
    return this
  }

  alertAction(action: string) {
    this.apsAlert().action = action;
    return this
  }

  alertActionLocKey(actionLocKey: string) {
    this.apsAlert()["action-loc-key"] = actionLocKey;
    return this
  }

  alertSummaryArg(summaryArg: string) {
    this.apsAlert()["summary-arg"] = summaryArg;
    return this
  }

  alertSummaryArgCount(summaryArgCount: number) {
    this.apsAlert()["summary-arg-count"] = summaryArgCount;
    return this
  }

  category(category: string) {
    this.aps().category = category;
    return this
  }

  threadID(threadID: string) {
    this.aps()["thread-id"] = threadID;
    return this

  }

  urlArgs(urlArgs: string[]) {
    this.aps()["url-args"] = urlArgs;
    return this
  }

  soundName(name: string) {
    this.apsSound().name = name;
    return this
  }

  soundVolume(volume: number) {
    this.apsSound().volume = volume;
    return this
  }

  interruptionLevel(level: EInterruptionLevel) {
    this.aps()["interruption-level"] = level;
    return this
  }

  relevanceScore(score: number) {
    this.aps()["relevance-score"] = score;
    return this
  }

  unsetRelevanceScore() {
    delete this.aps()["relevance-score"];
    return this
  }

  private apsAlert(): Alert {
    const alert = this.aps().alert || {}
    this.aps().alert = alert
    return alert
  }

  private apsSound(): Sound {
    const sound: Sound = this.aps().sound || {
      critical: 1,
      name: 'default',
      volume: 1.0
    }
    this.aps().sound = sound
    return sound
  }

  private aps() {
    return this.content.aps
  }

  get() {
    return this.content
  }
}
