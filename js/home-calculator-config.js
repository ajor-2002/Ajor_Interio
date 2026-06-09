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
  - BHK size: Below / Above sq.ft option
  - Project type: New Home / Renovation
  - Property type: Apartment / Independent House/Villa
  - Package: Standard / Premium / Luxe
  - Room counts: Living Room, Kitchen, Bedroom, Bathroom, Dining

  Step 2: Get estimated sq.ft
  - 1 BHK always uses bhkSizeReference[1].defaultSqft.
  - 2/3/4 BHK uses the selected BHK size label.

  Example:
  2 BHK + "Above 800 sq.ft" = 950 sq.ft

  Step 3: Get package rate per sq.ft
  Example:
  Premium = Rs. 1550 per sq.ft

  Step 4: Calculate area amount
  areaAmountInLakhs = (estimatedSqft x packageRatePerSqft) / 100000

  Example:
  950 sq.ft x Rs. 1550 = Rs. 14,72,500
  Rs. 14,72,500 / 100000 = 14.725L

  Step 5: Calculate selected room amount
  roomAmountInLakhs =
    Living Room count x livingRoom rate
    + Kitchen count x kitchen rate
    + Bedroom count x bedroom rate
    + Bathroom count x bathroom rate
    + Dining count x dining rate

  Example:
  1 Living Room x 1.2L = 1.2L
  1 Kitchen x 2.5L     = 2.5L
  2 Bedrooms x 1.4L    = 2.8L
  1 Bathroom x 0.6L    = 0.6L
  1 Dining x 0.8L      = 0.8L
  Room amount          = 7.9L

  Step 6: Add area amount + room amount
  baseAmount = areaAmountInLakhs + roomAmountInLakhs

  Step 7: Apply multipliers
  adjustedAmount =
    baseAmount
    x propertyTypeMultiplier
    x projectTypeMultiplier
    x packageMultiplier

  Step 8: Apply minimum lower amount
  lowerAmount = max(minimumLowerAmount, adjustedAmount)

  Step 9: Calculate upper estimate
  rangeGap = max(minimumRangeGap, lowerAmount x rangePercent)
  upperAmount = lowerAmount + rangeGap

  Step 10: Round numbers and display
  Result = Rs. lowerAmount L - Rs. upperAmount L


  WORKED EXAMPLE
  ------------------------------------------------
  User selects:
  - 2 BHK
  - Above 800 sq.ft
  - Apartment
  - Renovation
  - Premium
  - Living Room: 1
  - Kitchen: 1
  - Bedroom: 2
  - Bathroom: 1
  - Dining: 1

  Calculation:
  estimatedSqft = 950
  packageRatePerSqft = Rs. 1550
  areaAmount = 950 x 1550 / 100000 = 14.725L

  roomAmount =
    1 x 1.2
    + 1 x 2.5
    + 2 x 1.4
    + 1 x 0.6
    + 1 x 0.8
    = 7.9L

  baseAmount = 14.725 + 7.9 = 22.625L

  multipliers:
  Apartment = 1
  Renovation = 1.08
  Premium = 1.1

  adjustedAmount = 22.625 x 1 x 1.08 x 1.1 = 26.8785L
  lowerAmount = max(4, 26.8785) = 26.8785L
  rangeGap = max(3, 26.8785 x 0.15) = 4.031775L
  upperAmount = 26.8785 + 4.031775 = 30.910275L

  Rounded result:
  Rs. 27L - Rs. 31L


  EDITABLE PRICING REFERENCE
  ------------------------------------------------
  packageRatePerSqft:
  - Main area pricing by package.
  - Increase these if overall project pricing should go up.

  bhkSizeReference:
  - Estimated sq.ft used for each BHK/size option.
  - Labels must match the buttons shown in calculator page.

  roomRateInLakhs:
  - Extra cost for each selected room count.

  propertyTypeMultiplier:
  - Apartment can be normal rate.
  - Villa/Independent House can be higher.

  projectTypeMultiplier:
  - Renovation often costs more because of removal/rework.

  packageMultiplier:
  - Extra package quality multiplier after base sq.ft pricing.

  minimumLowerAmount:
  - Lowest starting estimate.

  minimumRangeGap:
  - Minimum difference between lower and upper estimate.

  rangePercent:
  - Upper range buffer.
  - 0.15 means 15% extra over lower estimate.
*/

window.AJOR_HOME_CALCULATOR_CONFIG = {
  minimumLowerAmount: 4,
  minimumRangeGap: 3,
  rangePercent: 0.15,

  packageRatePerSqft: {
    Standard: 1200,
    Premium: 1550,
    Luxe: 2200,
  },

  packageMultiplier: {
    Standard: 1,
    Premium: 1.1,
    Luxe: 1.25,
  },

  bhkSizeReference: {
    1: {
      defaultSqft: 550,
    },
    2: {
      'Below 800 sq.ft': 700,
      'Above 800 sq.ft': 950,
    },
    3: {
      'Below 1200 sq.ft': 1050,
      'Above 1200 sq.ft': 1450,
    },
    4: {
      'Below 1800 sq.ft': 1650,
      'Above 1800 sq.ft': 2200,
    },
  },

  roomRateInLakhs: {
    'Living Room': 1.2,
    Kitchen: 2.5,
    Bedroom: 1.4,
    Bathroom: 0.6,
    Dining: 0.8,
  },

  propertyTypeMultiplier: {
    Apartment: 1,
    'Independent House/Villa': 1.12,
  },

  projectTypeMultiplier: {
    'New Home': 1,
    Renovation: 1.08,
  },
};
