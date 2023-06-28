# SwiftMart


SwiftMart is an advanced Shopping platform built with Node.js, Express.js, React.js, and PostgreSQL. It provides a seamless shopping experience for users, with features like secure authentication, product filtering, searching, shopping cart functionality, and order management. This README provides an overview of the project.

## Features

- **Secure Authentication**: SwiftMart incorporates built-in secure JWT authentication and authorization using cookies, ensuring a safe and personalized experience for users.

- **Top Products Carousel**: The platform showcases a dynamic top products carousel, highlighting popular items and attracting users to explore the product catalog.

- **Product Filtering**: Users can easily filter products by price range and category, enabling them to quickly find the items they're looking for.

- **Robust Search**: SwiftMart offers a powerful search functionality that allows users to search for products based on their name or category, delivering accurate and relevant results.

- **Shopping Cart**: Users can add products to their cart, view the cart contents, and remove items as needed, providing a seamless shopping experience.

- **Secure Checkout**: SwiftMart integrates with Stripe API to facilitate secure credit/debit card payments, ensuring smooth and secure transactions for customers.

- **Order Management**: The platform includes an intuitive orders page where users can track the status of their orders, whether they have been shipped or are still pending.

- **User Profile Management**: Users can update their passwords and manage their profile information, ensuring a personalized and customizable experience.

- **Image Management**: SwiftMart utilizes Cloudinary to store and manage user profile pictures and product images, enhancing the visual appeal of the platform.

- **Admin Features**: SwiftMart includes powerful administrative features, allowing authorized users to access secure admin routes and perform various tasks:

    - **Product Database Management**: Admins have the ability to create, edit, and delete products in the PostgreSQL database. This feature provides complete control over the product catalog, ensuring up-to-date and accurate information.

    - **User Database Management**: Admins can manage user accounts, making it easy to create, edit, and delete user profiles as needed. This feature provides flexibility and control over user management.

    - **Order Database Management**: The platform includes an orders database that allows admins to view orders placed by users. Admins can update the status of each order, providing seamless communication and transparency with customers.
- **Entity Relationship Diagram (ERD)**: The PostgreSQL database in SwiftMart is designed using an Entity Relationship Diagram (ERD). This ERD establishes relationships between the different tables, ensuring data integrity and efficient data management.

## Technologies Used

- Node.js
- Express.js
- React.js
- PostgreSQL
- JWT for authentication
- Stripe API for payment processing
- Cloudinary for image management



