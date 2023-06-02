Delivery App
ElifTech School

This is a web application that allows users to browse and order delivery from different restaurants. It utilizes Firebase for data storage and retrieval, including product information and user orders.

Technologies Used:

JavaScript, 
Firebase, 
HTML,
CSS

Firebase Setup:
Create a Firebase project at firebase.google.com. Copy the Firebase configuration object into the provided code snippet. Enable Firestore and Storage in the Firebase project. Update the Firebase configuration object with the correct API keys and project information. Start the application: npm start

Usage:
Open the application in a web browser. Browse the available food items from different restaurants. Use the sidebar buttons to filter products by restaurant. Click "Add to Cart" to add products to your shopping cart. View and manage your shopping cart on the cart page. Fill in the user information and click "Submit Order" to place an order. A success message and order confirmation will be displayed.

Code Explanation:
The code is organized into different sections:

Firebase Configuration: Contains the necessary configuration object for connecting to Firebase. Data Retrieval: Fetches product data from Firestore and retrieves corresponding image URLs from Firebase Storage. Product Filtering: Allows users to filter products by restaurant using sidebar buttons. Shopping Cart: Manages the shopping cart, including adding products, updating quantities, and calculating the total price. Order Submission: Validates user input and submits the order to the 'orders' collection in Firestore.

Future Improvements:
Implement user authentication and account management features. Add a search functionality for easier product discovery. Include more advanced filtering options, such as sorting by price or category. Enhance the UI and overall user experience with improved styling and animations.
