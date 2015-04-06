# FSX

Function based JSX.

## Why?

Use plain JavaScript inside render.

```es6
import {fsx} from 'react-fsx'

export default class App extends React.Component {
    render() {
        var user = this.state.user
        var props = this.props
        return fsx(t => {
            //  `t` arg is optional in the lambda, `() =>` is ugly though
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
{fsx} = require('react-fsx')

module.exports = class App extends React.Component
    render: ->
        user = @state.user
        props = @props
        fsx (t) ->
            t.div ->
                if user
                    t.header ->
                        t.text user.userName
                        t.$ SideNav

                t.main {className: 'container'}, ->
                    t.div {className: 'row'}, ->
                        t.$ router.RouteHandler, props

                t.footer null
```

## No Magic

No need for spread literals. Boring wins.

```js
t.$(RouterHandler, _.merge(this.props, {pageno: 1}))
```
