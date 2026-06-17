
const fs = require("fs");

const baseUrl = "{{baseUrl}}";

function createItem(name, method, path, body = null) {
  const item = {
    name,
    request: {
      method,
      header: [],
      url: {
        raw: `${baseUrl}${path}`,
        host: ["{{baseUrl}}"],
        path: path.split("/").filter(Boolean)
      }
    }
  };
  
  if (body) {
    item.request.body = {
      mode: "raw",
      raw: JSON.stringify(body, null, 4),
      options: { raw: { language: "json" } }
    };
  }
  return item;
}

const collection = {
  info: {
    name: "Promoo API Full Collection",
    description: "Complete Postman collection with all 87+ APIs for the Promoo Backend.",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  variable: [
    { key: "baseUrl", value: "http://localhost:3000/api/v1", type: "string" },
    { key: "token", value: "YOUR_TOKEN_HERE", type: "string" }
  ],
  auth: {
    type: "bearer",
    bearer: [{ key: "token", value: "{{token}}", type: "string" }]
  },
  item: [
    {
      name: "1. Auth",
      item: [
        createItem("Register Email", "POST", "/auth/register/email", { email: "test@example.com", password: "password", fullName: "Test", accountType: "user" }),
        createItem("Register Phone", "POST", "/auth/register/phone", { phone: "+1234567890", password: "password", fullName: "Test", accountType: "user" }),
        createItem("Login Email", "POST", "/auth/login/email", { email: "test@example.com", password: "password" }),
        createItem("Login Phone", "POST", "/auth/login/phone", { phone: "+1234567890", password: "password" }),
        createItem("OAuth (Google/Apple)", "POST", "/auth/oauth", { provider: "google", idToken: "TOKEN_FROM_APP" }),
        createItem("Verify Token", "POST", "/auth/verify", {}),
        createItem("Send OTP", "POST", "/auth/otp/send", { email: "test@example.com" }),
        createItem("Verify OTP", "POST", "/auth/otp/verify", { email: "test@example.com", code: "123456" })
      ]
    },
    {
      name: "2. Profiles",
      item: [
        createItem("Get Own Profile", "GET", "/profiles/me"),
        createItem("Update Own Profile", "PUT", "/profiles/me", { bio: "New bio", location: "Dubai" }),
        createItem("Delete Account", "DELETE", "/profiles/me"),
        createItem("Get Profile by ID/Username", "GET", "/profiles/:idOrUsername"),
        createItem("Update Avatar", "POST", "/profiles/me/avatar", { avatarUrl: "https://example.com/image.jpg" }),
        createItem("Update Cover", "POST", "/profiles/me/cover", { coverUrl: "https://example.com/cover.jpg" }),
        createItem("Request Verification", "POST", "/profiles/me/verify-request", { documents: ["url1"] })
      ]
    },
    {
      name: "3. Follows",
      item: [
        createItem("Follow User", "POST", "/follows/:profileId"),
        createItem("Unfollow User", "DELETE", "/follows/:profileId"),
        createItem("Check Follow Status", "GET", "/follows/:profileId/status"),
        createItem("Get Followers", "GET", "/profiles/:profileId/followers?page=1&limit=20"),
        createItem("Get Following", "GET", "/profiles/:profileId/following?page=1&limit=20")
      ]
    },
    {
      name: "4. Categories & Search",
      item: [
        createItem("Get Categories", "GET", "/categories"),
        createItem("Get Category Content", "GET", "/categories/:categoryId/content?page=1&limit=20"),
        createItem("Global Search", "GET", "/search?q=test&type=all&page=1&limit=20")
      ]
    },
    {
      name: "5. Offers",
      item: [
        createItem("Get All Offers", "GET", "/offers?page=1&limit=20"),
        createItem("Get Offer By ID", "GET", "/offers/:offerId"),
        createItem("Create Offer", "POST", "/offers", { categoryId: "UUID", title: "Offer 1", description: "Desc", offerPrice: 100, startDate: "2026-06-01T00:00:00Z" }),
        createItem("Update Offer", "PUT", "/offers/:offerId", { title: "Updated Offer" }),
        createItem("Delete Offer", "DELETE", "/offers/:offerId"),
        createItem("Get User Offers", "GET", "/profiles/:profileId/offers?page=1")
      ]
    },
    {
      name: "6. Ads",
      item: [
        createItem("Create Ad", "POST", "/ads", { title: "My Ad", mediaUrl: "url", adType: "banner", budget: 100, startDate: "2026-06-01T00:00:00Z" }),
        createItem("Update Ad", "PUT", "/ads/:adId", { title: "Updated Ad" }),
        createItem("Toggle Ad Status", "PATCH", "/ads/:adId/toggle"),
        createItem("Get Ad Stats", "GET", "/ads/:adId/stats"),
        createItem("Record Impression", "POST", "/ads/:adId/impression"),
        createItem("Record Click", "POST", "/ads/:adId/click")
      ]
    },
    {
      name: "7. Subscriptions & Payments",
      item: [
        createItem("Get Plans", "GET", "/subscriptions/plans"),
        createItem("Create Checkout Session", "POST", "/subscriptions", { planId: "UUID" }),
        createItem("Get My Subscription", "GET", "/subscriptions/me"),
        createItem("Manage Subscription (Portal)", "POST", "/subscriptions/manage"),
        createItem("Get Payment History", "GET", "/payments/history?page=1"),
        createItem("Stripe Webhook (DO NOT USE IN POSTMAN)", "POST", "/webhooks/stripe")
      ]
    },
    {
      name: "8. Featured",
      item: [
        createItem("Get Featured Listings", "GET", "/featured"),
        createItem("Request Featured Status", "POST", "/featured", { placement: "home", durationDays: 7 })
      ]
    },
    {
      name: "9. Chat",
      item: [
        createItem("Get All Chats", "GET", "/chats"),
        createItem("Start/Open Chat", "POST", "/chats", { participantId: "UUID" }),
        createItem("Get Messages", "GET", "/chats/:roomId/messages?page=1"),
        createItem("Send Message", "POST", "/chats/:roomId/messages", { content: "Hello!" }),
        createItem("Mark Chat Read", "PATCH", "/chats/:roomId/read"),
        createItem("Delete Chat", "DELETE", "/chats/:roomId")
      ]
    },
    {
      name: "10. Notifications",
      item: [
        createItem("Get Notifications", "GET", "/notifications?page=1"),
        createItem("Register FCM Token", "POST", "/notifications/token", { token: "FCM_TOKEN", deviceType: "ios" }),
        createItem("Mark All As Read", "PATCH", "/notifications/read-all"),
        createItem("Mark One As Read", "PATCH", "/notifications/:notificationId/read"),
        createItem("Delete Notification", "DELETE", "/notifications/:notificationId")
      ]
    },
    {
      name: "11. Upload (Requires multipart/form-data)",
      item: [
        createItem("Upload Image", "POST", "/upload/image"),
        createItem("Upload Video", "POST", "/upload/video"),
        createItem("Upload File", "POST", "/upload/file"),
        createItem("Delete File", "DELETE", "/upload/:fileId")
      ]
    },
    {
      name: "12. Reports",
      item: [
        createItem("Submit Report", "POST", "/reports", { reportedId: "UUID", reportedType: "profile", reason: "Spam" }),
        createItem("Get Reports (Admin)", "GET", "/reports?page=1")
      ]
    },
    {
      name: "13. Admin Dashboard",
      item: [
        createItem("Get Stats", "GET", "/admin/stats"),
        createItem("Get Users", "GET", "/admin/users?page=1"),
        createItem("Ban/Unban User", "PATCH", "/admin/users/:userId/ban", { isActive: false }),
        createItem("Verify/Unverify User", "PATCH", "/admin/users/:userId/verify", { isVerified: true }),
        createItem("Get Admin Offers", "GET", "/admin/offers?page=1"),
        createItem("Update Offer Status", "PATCH", "/admin/offers/:offerId/status", { status: "rejected" }),
        createItem("Get Admin Ads", "GET", "/admin/ads?page=1"),
        createItem("Update Ad Status", "PATCH", "/admin/ads/:adId/status", { status: "rejected" })
      ]
    }
  ]
};

fs.writeFileSync("promoo_postman_collection.json", JSON.stringify(collection, null, 2));
console.log("Generated full Postman collection successfully!");

