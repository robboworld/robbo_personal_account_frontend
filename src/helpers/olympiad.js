/** Index of the stage running on `now` (stage.end is an inclusive YYYY-MM-DD), or -1 after the season. */
export function currentOlympiadStage (timeline, now = new Date()) {
  const today = now.toISOString().slice(0, 10)
  return timeline.findIndex(stage => stage.end >= today)
}
