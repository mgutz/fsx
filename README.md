# FSX

Function based JSX.

## Why?

Use plain JavaScript (if-else, for-of, lodash) inside render.

```es6
export default class App extends React.Component {
    render() {
        var user = this.state.user
        var props = this.props
        return fsx(t => {
            t.div(t => {
                if (user) {
                    t.header(t => {
                        t.text(user.name)
                        t.$(SideNav)
                    })
                }

                t.main({className: 'container'}, t => {
                    t.div({className: 'row'}, t => {
                        t.$(router.RouteHandler, props)
                    })
                })

                t.footer()
            })
        })
    }
}
```

CoffeeScript

```coffeescript
module.exports = class App extends React.Component
    render: ->
        user = @state.user
        props = @props
        fsx (t) ->
            t.div (t) ->
                if user
                    t.header (t) ->
                        t.text user.userName
                        t.$ SideNav

                t.main {className: 'container'}, (t) ->
                    t.div {className: 'row'}, (t) ->
                        t.$ router.RouteHandler, props

                t.footer null
```

## No Magic

No need for spread literals. Boring wins.

```js
t.$(RouterHandler, _.merge(this.props, {pageno: 1}))
```
