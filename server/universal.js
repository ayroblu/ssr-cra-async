const path = require('path')
const fs = require('fs')

const React = require('react')
const {Provider} = require('react-redux')
const {renderToString, renderToStaticMarkup} = require('react-dom/server')
const {StaticRouter} = require('react-router-dom')

const api = require('./api')
const {default: configureStore} = require('../src/store')
const {default: App} = require('../src/containers/App')

module.exports = function universalLoader(req, res) {
  const filePath = path.resolve(__dirname, '..', 'build', 'index.html')

  fs.readFile(filePath, 'utf8', async (err, htmlData)=>{
    if (err) {
      console.error('read err', err)
      return res.status(404).end()
    }
    const context = {data: {}, head: [], req, api}
    const store = configureStore()
    renderToString(
      <Provider store={store}>
        <StaticRouter
          location={req.url}
          context={context}
        >
          <App/>
        </StaticRouter>
      </Provider>
    )
    const keys = Object.keys(context.data)
    const promises = keys.map(k=>context.data[k])
    try {
      const resolved = await Promise.all(promises)
      resolved.forEach((r,i)=>context.data[keys[i]]=r)
    } catch (err) {
     // Render a better page than that? or just send the original markup, let the frontend handle it. Many options here
      console.error('err', err)
      return res.status(400).json({message: "Uhhh, some thing didn't work"})
    }
    const markup = renderToString(
      <Provider store={store}>
        <StaticRouter
          location={req.url}
          context={context}
        >
          <App/>
        </StaticRouter>
      </Provider>
    )
    const headMarkup = context.head.map(h=>(
      renderToStaticMarkup(h)
    )).join('')

    if (context.url) {
      // Somewhere a `<Redirect>` was rendered
      redirect(301, context.url)
    } else {
      // we're good, send the response
      const RenderedApp = htmlData.replace('{{SSR}}', markup)
        .replace('{{head}}', headMarkup)
        .replace('{data:{}}', JSON.stringify(context.data))
      if (context.code)
        res.status(context.code)
      res.send(RenderedApp)
    }
  })
}

