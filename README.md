## A.C.M.E. Shop Documentation

Package Used
===

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
[Axios](https://www.npmjs.com/package/react-axios) package was used for ajax calls.
React Router Dom for routing multiple pages.


Styling
===

For styling ['CSS Modules'](https://github.com/gajus/react-css-modules)  were used (standard procedure: eject of the project, config changes...)



## Structure of the Web Application


Containers (stateful components)
===

Stateful Page component with three extensions Catalog, Article Page and Cart.
Poc of a Checkout and an Orders page (modal popup)

Components (stateless components)


UI
===

Small UI Helper components


Navigation
===

Navigation elements like Sidedrawer for mobile, NavigationItems and toolbar (top menu) 


Hoc
===
Higher order components to wrap up inner components and errors.

Caveat
---
Component Aux was renamed in order to work on Windows platforms (Aux is a forbidden filename)


Logic of the application
===
Available catalog articles are presented to the user (after a HTTP GET action), every time a product is added to the cart the total items count and the total price are updated.
Every time a product is added an HTTP PUT action is triggered in order to retrieve correct information from the server.
Any time a cart is updated, the data are stored in a Local Storage (the window.localStorage browser object) field inside the browser. This allows to keep track of the changes but also to restore cart information if the user closes the browser and reopen it after a while.
The user can add or remove any article or change the quantity inside the cart page.
If there is at list an item inside the cart, the user can checkout.
After the checkout the cart information are delete from the browser and the user is redirect to the catalog page.