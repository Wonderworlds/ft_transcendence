export function myDebug(event: string, body?: any, value?: any) {
  body
    ? value
      ? console.info({ event: event, body: body, value: value })
      : console.info({ event: event, body: body })
    : console.info({ event: event });
}
