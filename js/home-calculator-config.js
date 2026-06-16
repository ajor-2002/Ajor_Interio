/*
  Ajor Interio - Home Interior Calculator Formula
  ------------------------------------------------
  This file controls the Home Interior Calculator amount.
  Edit rates here when you want to change pricing.

  All final output amounts are shown in lakhs.
  Example: 8 means Rs. 8,00,000.

  FULL FORMULA USED BY THE WEBSITE
  ------------------------------------------------

  Step 1: Read user selections
  - BHK type: 1 BHK, 2 BHK, 3 BHK, 4 BHK
  - Project type: New Home / Renovation
  - Property type: Apartment / Villa / Independent House
  - Package: Standard / Premium / Luxury
  - Room counts: Living Room, Kitchen, Bedroom, Bathroom, Dining

  Step 2: Get base cost for BHK and package
  baseCost = baseCostByBhkAndPackage[bhk][package]

  Example:
  2 BHK + Premium = 9L

  Step 3: Calculate room amount
  roomAmountInLakhs =
    Living Room count x livingRoom rate
    + Kitchen count x kitchen rate
    + Bedroom count x bedroom rate
    + Bathroom count x bathroom rate
    + Dining count x dining rate

  Example:
  1 Living Room x 1.0L = 1.0L
  1 Kitchen x 2.0L     = 2.0L
  2 Bedrooms x 1.2L    = 2.4L
  1 Bathroom x 0.5L    = 0.5L
  1 Dining x 0.8L      = 0.8L
  Room amount          = 6.7L

  Step 4: Add base cost + room amount
  subtotal = baseCost + roomAmountInLakhs

  Step 5: Apply multipliers
  adjustedAmount =
    subtotal
    x propertyTypeMultiplier
    x projectTypeMultiplier

  Step 6: Calculate upper estimate
  upperAmount = adjustedAmount + (adjustedAmount x rangePercent)

  Step 7: Round numbers and display
  lowerAmount = adjustedAmount
  upperAmount = lowerAmount + (lowerAmount x rangePercent)
  Result = Rs. lowerAmount L - Rs. upperAmount L


  WORKED EXAMPLE
  ------------------------------------------------
  User selects:
  - 2 BHK
  - Premium
  - Apartment
  - Renovation
  - Living Room: 1
  - Kitchen: 1
  - Bedroom: 2
  - Bathroom: 1
  - Dining: 1

  Calculation:
  baseCost = 9L

  roomAmount =
    1 x 1.0
    + 1 x 2.0
    + 2 x 1.2
    + 1 x 0.5
    + 1 x 0.8
    = 6.7L

  subtotal = 9 + 6.7 = 15.7L

  multipliers:
  Apartment = 1
  Renovation = 1.1

  adjustedAmount = 15.7 x 1 x 1.1 = 17.27L
  upperAmount = 17.27 + (17.27 x 0.15) = 19.8605L

  Rounded result:
  Rs. 17L - Rs. 20L


  EDITABLE PRICING REFERENCE
  ------------------------------------------------
  baseCostByBhkAndPackage:
  - Core pricing by BHK and package.
  - Keep the labels aligned with the buttons in calculator page.
  - "Luxe" is kept as an alias for older UI labels.

  roomRateInLakhs:
  - Extra cost for each selected room count.

  propertyTypeMultiplier:
  - Apartment can be normal rate.
  - Villa and Independent House can be slightly higher.
  - "Independent House/Villa" is kept as an alias for older UI labels.

  projectTypeMultiplier:
  - Renovation often costs more because of removal/rework.

  rangePercent:
  - Upper range buffer.
  - 0.15 means 15% extra over the adjusted estimate.
*/

window.AJOR_HOME_CALCULATOR_CONFIG = {
  rangePercent: 0.15,

  baseCostByBhkAndPackage: {
    1: {
      Standard: 1.5,
      Premium: 3.5,
      Luxury: 5,
      Luxe: 5,
    },
    2: {
      Standard: 3.2,
      Premium: 6.5,
      Luxury: 9,
      Luxe: 9,
    },
    3: {
      Standard: 5.5,
      Premium: 9,
      Luxury: 12,
      Luxe: 12,
    },
    4: {
      Standard: 6.5,
      Premium: 10,
      Luxury: 15,
      Luxe: 15,
    },
  },

  roomRateInLakhs: {
    livingRoom: 0.7,
    kitchen: 1.5,
    bedroom: 0.9,
    bathroom: 0.35,
    dining: 0.55,
  },

  propertyTypeMultiplier: {
    Apartment: 1,
    Villa: 1.15,
    'Independent House': 1.1,
    'Independent House/Villa': 1.1,
  },

  projectTypeMultiplier: {
    'New Home': 1,
    Renovation: 1.1,
  },
};
