const express = require("express");
const { users } = require("../data/users.json");
const router = express.Router();
/*
 *Route: /
 *Method:GET
 *Description:Get all users
 *Access: public
 *Parameters: none
 */
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: users,
  });
});
/*
 *Route: /:id
 *Method:GET
 *Description:Get user by id
 *Access: public
 *Parameters: id
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;
  // const id= req.params.id;
  const user = users.find((each) => each.id === id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  return res.status(200).json({
    success: true,
    message: "user found",
    data: user,
  });
});
/*
 *Route: /
 *Method:POST
 *Description:Creating new user
 *Access: public
 *Parameters: none
 */
router.post("/", (req, res) => {
  const { id, name, surname, email, subscriptionType, subscriptionDate } =
    req.body;

  const user = users.find((each) => each.id === id);

  if (user) {
    return res.status(404).json({
      success: false,
      message: "User already exists",
    });
  }
  users.push({
    id,
    name,
    surname,
    email,
    subscriptionType,
    subscriptionDate,
  });
  return res.status(201).json({
    success: true,
    message: "New User added",
    data: users,
  });
});
/*
 *Route: /:id
 *Method:PUT
 *Description:updating a user by their id
 *Access: public
 *Parameters: id
 */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  const user = users.find((each) => each.id === id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not Exists",
    });
  }
  const updateUserData = users.map((each) => {
    if (each.id === id) {
      return {
        ...each,
        ...data,
      };
    }
    return each;
  });
  return res.status(200).json({
    success: true,
    message: "User updated",
    data: updateUserData,
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((each) => each.id === id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User doesnt exist",
    });
  }
  const index = users.indexOf(user);
  users.splice(index, 1);

  return res.status(200).json({
    success: true,
    message: "User deleted",
    data: users,
  });
});
/*
 *Route: /userss/subscription-details/:id
 *Method:Get
 *Description: Get all users subscription details
 *Access: public
 *Parameters: id
 */
router.get("/subscription-details/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((each) => each.id === id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User with id doesn't exist",
    });
  }

  // Helper function to parse date or return the current date if empty
  const parseDate = (dateString) => {
    return dateString ? new Date(dateString) : new Date();
  };

  // Function to calculate the expiration date based on the subscription type
  const calculateSubscriptionExpiration = (subscriptionStartDate) => {
    const startDate = new Date(subscriptionStartDate);
    if (user.subscriptionType === "Basic") {
      startDate.setDate(startDate.getDate() + 90); // Add 90 days for Basic
    } else if (user.subscriptionType === "Standard") {
      startDate.setDate(startDate.getDate() + 180); // Add 180 days for Standard
    } else if (user.subscriptionType === "Premium") {
      startDate.setDate(startDate.getDate() + 365); // Add 365 days for Premium
    }
    return startDate;
  };

  // Parsing the dates
  let returnDate = parseDate(user.returnDate); // Date user needs to return a book
  let currentDate = new Date(); // Current date
  let subscriptionDate = parseDate(user.subscriptionDate); // Subscription start date
  let subscriptionExpirationDate =
    calculateSubscriptionExpiration(subscriptionDate); // Expiration date based on subscription type

  console.log("Current Date:", currentDate);
  console.log("Return Date:", returnDate);
  console.log("Subscription Expiration Date:", subscriptionExpirationDate);

  // Determine if the subscription is expired
  const isSubscriptionExpired = subscriptionExpirationDate < currentDate;

  console.log("Is Subscription Expired:", isSubscriptionExpired);

  // Calculate days left for expiration
  const daysLeftForExpiration = isSubscriptionExpired
    ? 0
    : Math.ceil(
        (subscriptionExpirationDate - currentDate) / (1000 * 60 * 60 * 24)
      );

  // Calculate fine
  let fine = 0;
  if (returnDate < currentDate) {
    console.log("Return date is in the past.");
    if (isSubscriptionExpired) {
      fine = 100; // Fine if subscription expired and book return is late
      console.log("Subscription expired, fine = 100");
    } else {
      fine = 50; // Fine if book return is late but subscription is still valid
      console.log("Subscription still valid, fine = 50");
    }
  } else {
    console.log("Return date is in the future or today, no fine.");
  }

  const data = {
    ...user,
    isSubscriptionExpired,
    daysLeftForExpiration,
    fine,
  };

  return res.status(200).json({
    success: true,
    message: "Subscription detail for user is : ",
    data,
  });
});

module.exports = router;
