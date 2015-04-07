# FSX

Function based JSX.

## Why?

- Use plain JavaScript inside render.
- Use attributes `class` and `for`

CoffeeScript

```coffeescript
{fsx} = require("react-fsx")
module.exports = class App extends React.Component

    users: (t) =>
        ["mario", "grant"].map (user) ->
            t.p user

    render: -> fsx {SideNav, RouteHandler}, (t) =>
        users = @users
        props = @props
        t.div ->
            t.header ->
                t.SideNav null
                users t

            t.main {class:"container"}, ->
                t.div {class:"row"}, ->
                    t.RouteHandler props

            t.footer null
```

Or

```coffeescript
{createContext} = require("react-fsx")
{SideNav, RouteHandler, fsx, div, header, main, div, footer, text, append} =
    createContext({SideNav, RouteHandler}, "fsx", "div", "header", "main", "footer", "text", "append")

module.exports = class App extends React.Component

    render: -> fsx =>
        props = @props
        div ->
            header ->
                text "Hello"
                SideNav null

            main {class:"container"}, ->
                div {class:"row"}, ->
                    RouteHandler props

            footer null
```

## No Magic

No need for spread literals. Boring wins.

```js
t.$(RouterHandler, _.merge(this.props, {pageno: 1}))
```

ES6

```javascript
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

