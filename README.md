# Mini Wordpress

## User Routes:

Route | HTTP | Header(s) | Request(s) | Response(s) | Description
---|---|---|---|---|---
`/register` | POST | `none` | **Body**<br>name: `String`<br>email: `String`<br>password: `String` | **Success**<br>`201` Created<br>**Fail**<br>`500` Internal server error | Create a new user
`/users` | GET | `none` | `none` | **Success**<br>`200` OK<br>**Fail**<br>`500` Internal server error | Get all the users
`/users/:id` | GET | `none` | **Headers**<br>_id: `String` | **Success**<br>`200` OK<br>**Fail**<br>`500` Internal server error | Get one user
`/users/:id` | PUT | `none` | **Headers**<br>_id: `String`<br>**body**<br>name: `String`<br>email: `String`<br>password: `String` | **Success**<br>`200` OK<br>**Fail**<br>`401` Unauthorized<br>`500` Internal server error | Update a user
`/users/:id` | DELETE | `none` | **Headers**<br>id: `String` | **Success**<br>`204` No content<br>**Fail**<br>`401` Unauthorized<br>`500` Internal server error | Delete a user

## Article Routes:

Route | HTTP | Header(s) | Request(s) | Response(s) | Description
---|---|---|---|---|---
`/articles` | GET | `none` | `none` | **Success**<br>`200` OK<br>**Fail**<br>`500` Internal server error | Get all the articles
`/articles/:id` | GET | `none` | **Headers**<br>_id: `String` | **Success**<br>`200` OK<br>**Fail**<br>`500` Internal server error | Get one article
`/articles/:id` | PUT | `none` | **Headers**<br>_id: `String`<br>**body**<br>title: `String`<br>content: `String`<br>author: `String`<br>featuredImg: `String` | **Success**<br>`200` OK<br>**Fail**<br>`401` Unauthorized<br>`500` Internal server error | Update an article
`/articles/:id` | DELETE | `none` | **Headers**<br>id: `String` | **Success**<br>`204` No content<br>**Fail**<br>`401` Unauthorized<br>`500` Internal server error | Delete an article