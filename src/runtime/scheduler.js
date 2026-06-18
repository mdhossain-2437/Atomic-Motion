export function createFrameScheduler(options = {}) {
  const autoStart = options.autoStart !== false
  const requestFrame = options.requestAnimationFrame ?? globalThis.requestAnimationFrame

  const readQueue = []
  const writeQueue = []
  let scheduled = false

  function schedule() {
    if (!autoStart || scheduled) return
    if (typeof requestFrame !== 'function') return

    scheduled = true
    requestFrame(() => flush())
  }

  function read(task) {
    assertTask(task)
    readQueue.push(task)
    schedule()
  }

  function write(task) {
    assertTask(task)
    writeQueue.push(task)
    schedule()
  }

  function flush() {
    scheduled = false

    const reads = readQueue.splice(0)
    const writes = writeQueue.splice(0)

    for (const task of reads) task()
    for (const task of writes) task()
  }

  function prepareElement(element, value = 'transform, opacity') {
    if (!element?.style?.setProperty) return
    element.style.setProperty('will-change', value)
  }

  function releaseElement(element) {
    write(() => {
      if (element?.style?.removeProperty) {
        element.style.removeProperty('will-change')
      }
    })
  }

  return {
    read,
    write,
    flush,
    prepareElement,
    releaseElement,
  }
}

function assertTask(task) {
  if (typeof task !== 'function') {
    throw new TypeError('Frame scheduler tasks must be functions.')
  }
}
