const URL = 'http://127.0.0.1:3000/search'
import { fetchEventData } from 'fetch-sse'

export interface IQueryOptions {
  ctrl?: AbortController,
  stream?: boolean,
  model?: string,
  onMessage: (data: Record<string, any>) => void,
  onOpen?: () => void,
  onClose?: () => void,
  onError?: (e: any) => void
}
export async function search(q: string, options: IQueryOptions) {
  const { ctrl, stream = true, model, onMessage, onOpen, onClose, onError } = options
  const query = new URLSearchParams({
    q
  })
  await fetchEventData(`${URL}?${query.toString()}`, {
    method: 'POST',
    signal: ctrl?.signal,
    data: {
      stream,
      model
    },
    headers: {
      'Content-Type': 'application/json'
    },
    onOpen: async () => {
      // error
      onOpen?.()
    },
    onMessage: (e) => {
      try {
        const data = JSON.parse(e?.data || '{}')
        onMessage(JSON.parse(data.data || '{}'))
      } catch (err) {
        onError?.(err)
      }
    },
    onClose,
    onError
  })
}
