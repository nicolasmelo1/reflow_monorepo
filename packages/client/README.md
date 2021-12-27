# Reflow Client Monorepo

This is also a monorepo where you will find all of the interface of the application. This monorepo holds every aspect on
how we can interact to a user: through desktop, through mobile and through web at the current time but we can add even
virtual reality, or voice if needed. This is just how the client interact with us. 
The most important at the given time is web, the second one is mobile.

It's important to understand that we want to be able to program everything at once, at least this is the best option.
So we don't need to rewrite logic in many places and just reuse the same logic between mobile or web environments.
This means everything from the web version will also be available in a mobile version and vice versa.

This also contains a `shared` folder where you will find most of the components needed to build the interface. The components are structured in the [container/presentation pattern](https://www.patterns.dev/posts/presentational-container-pattern/) so, all your components MUST implement the logic separated from the `render`. 
Stuff like context and so on are not necessary to be implemented in the render, unless it's super tied to how e render stuff.

This implementation makes it easier for testing and debugging interfaces since we just need to send data and don't need to care about any side effects.