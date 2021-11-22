import { Router, Request } from 'itty-router'
import { nanoid } from 'nanoid'
import index from './views'
import url_template from './views/url'

declare const URLS: KVNamespace
const router = Router()

addEventListener('fetch', (event) => {
  event.respondWith(router.handle(event.request))
})

router.get('/', async () => {
  return new Response(index(), {
    headers: { 'content-type': 'text/html' },
  })
})

router.post('/', async (request: Request) => {
  const formData = await request?.formData?.()
  let url = formData.get('url')

  if (typeof url === 'string') {
    if (!url.includes('http')) {
      url = `http://${url}`
    }

    const expression =
      // eslint-disable-next-line no-useless-escape
      /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    const regex = new RegExp(expression)

    if (regex.test(url)) {
      const id = nanoid(7)
      await URLS.put(id, url)

      return new Response(
        url_template('https://url-shortener.himar.workers.dev/' + id),
        {
          headers: { 'content-type': 'text/html' },
        },
      )
    } else {
      return new Response('Bad request', { status: 400 })
    }
  }
})

router.get('/:id', async ({ params }) => {
  const id = params?.id

  if (!id) return new Response('Not Found', { status: 404 })

  const url = await URLS.get(id)

  if (url) {
    return Response.redirect(url, 301)
  } else {
    return new Response('Not Found', { status: 404 })
  }
})

router.all('*', () => new Response('Not Found', { status: 404 }))
