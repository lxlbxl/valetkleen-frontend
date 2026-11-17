# API contract

All UI data goes through `src/lib/api/index.ts`. Client components call these functions through
Server Actions in `src/lib/api/actions.ts`. Server components import them directly. Each function
runs against mock data today. To connect the backend, replace the function body with a call to
`http()` (or a direct Prisma or service call if this code moves into the backend app). Keep the
signature the same, and no page has to change.

Types live in `src/lib/types.ts`. Money is integer cents.

The backend paths are left blank on purpose. This frontend was built without access to the
ValetKleen-Backend code, so the backend developer should map each function to an existing route
handler or add one.

## Customer

| Function | Used by | Returns | Notes |
|---|---|---|---|
| `getPriceBook()` | home, booking, prices, weigh-in | `PriceBook` | Must come from editable config, not constants. See the Pre-Implementation Review, section 4. |
| `getCatalog()` | home, booking, prices, ops pricing | `CatalogItem[]` | Per-item prices (dry cleaning, press only, hang dry). |
| `checkCoverage(zip)` | `/check` | `CoverageResult` | Covered: zone and the next 3 windows. Not covered: the live zones. |
| `joinWaitlist({email, zip, consent})` | `/check` (C3) | `{ok}` | Feeds the zone launch gate. |
| `getPickupWindows(zip)` | `/book/pickup` | `PickupWindow[]` | Status is available, few_left or full (capacity). |
| `createBooking(draft)` | `/book/checkout` | `{orderId, number}` | Saves the card with a Stripe **SetupIntent**. It does **not** charge. |
| `applyPromo(code)` | checkout | `{valid, message}` | Promo and referral codes. |
| `getCurrentCustomer()` | account, plans, orders | `Customer` | Session user. |
| `listMyOrders()` / `getOrder(id)` | `/orders`, `/orders/[id]` | `Order[]` / `Order` | Must not expose the partner identity. |
| `cancelOrder(id)` | order page | `{ok}` | Allowed only while the status is `booked`. |
| `rateOrder(id, rating)` | delivered order | `{ok}` | Order and driver stars, plus a comment. |
| `reportProblem({orderId, kind, details, photos})` | `/orders` | `{ok}` | Creates a claim. Photos go to object storage. |
| `updateSubscription(plan)` | `/plans` | `{ok}` | Stripe Billing: Pass or Family. `per_order` cancels. |
| `updateProfile(patch)` | `/account` | `{ok}` | Name, email, phone, notification preferences. |
| `signIn` / `signUp` / `requestPasswordReset` | auth pages | `{ok}` | Replace with Auth.js. Staff sign-in needs a TOTP code. |

## Ops console

| Function | Screen | Notes |
|---|---|---|
| `opsDashboard()` | A2 | Counts and alert list. |
| `listOrders({zoneId})` | A3, A5, A11 | Full orders, including internal fields. |
| `listDrivers()` / `addDriver()` | A5 | Drivers have a name and phone only, no login. |
| `assignTrip(orderId, "pickup" \| "return", driverId)` | A5 | Two trips per order. |
| `suggestAssignments()` | A5 | Returns proposals. Ops approves each one. |
| `sendOnTheWayText(orderIds)` | A5 | SMS (Twilio). |
| `recordHandoff(orderId, {type, tag, by, photoUrl, source})` | A6 | Append-only chain of custody. Moves the order status. |
| `submitWeighIn(orderId, {weightLbs, itemCount, notes, charge})` | A7 | Charges the saved card when `charge` is true. Runs the margin check. |
| `listPartners()` | A8 | Internal only. |
| `listZones()` / `addZip()` / `getLaunchGate()` | A9 | Waitlist CSV at `/api/waitlist.csv`. |
| `listAiSuggestions()` / `decideSuggestion()` | A10 | AI pricing and plan suggestions need approval. |
| `listClaims()` / `resolveClaim()` | A11 | Partial refund, credit, or reject with a reason. |
| `listPayouts()` / `markWeekPaid()` | A12 | Weekly driver and partner payouts. |

## Order status

`booked → driver_en_route → picked_up → at_partner → weighed → charged → out_for_delivery → delivered`
(or `cancelled`). Customers never see `weighed` as its own step. It shows as "ValetKleen is
cleaning it" until the charge succeeds.
