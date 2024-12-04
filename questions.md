1.What is the difference between Component and PureComponent? Give an example where it might break my app.
Component: re-renders every time its parent re-renders or its state/props change
PureComponent: only re-renders if its props and state change, but to check it PureComponent do a non-deep comparison
For example, if an object passed as a prop is mutated but its reference doesn't change, PureComponent won't trigger a re-render

2.Context + ShouldComponentUpdate might be dangerous. Why is that?
Using shouldComponentUpdate with context can be dangerous because it might prevent re-renders when context changes. This happens because context allows to pass information directly.

3.Describe 3 ways to pass information from a component to its PARENT.
Using useContext or Redux
Callback function passed from parent to child
Triggering an event from child

4.Give 2 ways to prevent components from re-rendering.
Using memoization (React.memo) or using shouldComponentUpdate

5.What is a fragment and why do we need it? Give an example where it might break my app.
Is a wrapper that lets you group a list of children without adding extra nodes.
It's a problem if you use a fragment to wrap the elements of a list without providing keys.

6.Give 3 examples of the HOC pattern.
Wrap components to log render events.
Render a component if certain conditions are ok.
Wrap components to handle authentication.

7.What's the difference in handling exceptions in promises,
callbacks and async...await?
Using promises you have to use .catch
Aync/Await using "try...catch" block
In callbacks you pass the error as argument

8.How many arguments does setState take and why is it async.
The function to update the state. An optional function to exec before the state is updated
setState is asynchronous to batch multiple state updates together

9.List the steps needed to migrate a Class to Function
Component.
Use "return" instead "render"
"UseEffect" instead "Lifecycle methods"
Remove "this" references

10.List a few ways styles can be used with components.
Inline styles
Importing a CSS typical file
Importing javascript objects with css
Using libraries such as "Styled-components"

11.How to render an HTML string coming from the server.
Sanitazing the HTML
