/*
  Ajor Interio - Home Interior Calculator Formula
  ------------------------------------------------
  Edit this file when you want to change calculator pricing.

  IMPORTANT:
  - All amount values below are in lakhs.
  - Example: 4 means Rs. 4,00,000.
  - The calculator output is shown as: Rs. lowerAmount L - Rs. upperAmount L.

  Current formula:
  1. Get selected BHK number.
     Example: "2 BHK" becomes 2.

  2. Get selected package rate per BHK.
     Standard = 4L per BHK
     Premium  = 6L per BHK
     Luxe     = 9L per BHK

  3. Calculate lower amount:
     lowerAmount = BHK number x selected package rate

     But if lowerAmount is less than minimumLowerAmount,
     then minimumLowerAmount is used.

     Final:
     lowerAmount = max(minimumLowerAmount, BHK number x package rate)

  4. Calculate upper amount gap:
     rangeGap = BHK number x rangeGapPerBhk

     But if rangeGap is less than minimumRangeGap,
     then minimumRangeGap is used.

     Final:
     rangeGap = max(minimumRangeGap, BHK number x rangeGapPerBhk)

  5. Calculate upper amount:
     upperAmount = lowerAmount + rangeGap

  6. Final display:
     Rs. lowerAmount L - Rs. upperAmount L

  Examples with current values:
  ------------------------------------------------
  1 BHK + Standard:
  lowerAmount = max(4, 1 x 4) = 4
  rangeGap    = max(3, 1 x 2) = 3
  upperAmount = 4 + 3 = 7
  Result      = Rs. 4L - Rs. 7L

  2 BHK + Standard:
  lowerAmount = max(4, 2 x 4) = 8
  rangeGap    = max(3, 2 x 2) = 4
  upperAmount = 8 + 4 = 12
  Result      = Rs. 8L - Rs. 12L

  2 BHK + Premium:
  lowerAmount = max(4, 2 x 6) = 12
  rangeGap    = max(3, 2 x 2) = 4
  upperAmount = 12 + 4 = 16
  Result      = Rs. 12L - Rs. 16L

  3 BHK + Luxe:
  lowerAmount = max(4, 3 x 9) = 27
  rangeGap    = max(3, 3 x 2) = 6
  upperAmount = 27 + 6 = 33
  Result      = Rs. 27L - Rs. 33L

  4 BHK + Luxe:
  lowerAmount = max(4, 4 x 9) = 36
  rangeGap    = max(3, 4 x 2) = 8
  upperAmount = 36 + 8 = 44
  Result      = Rs. 36L - Rs. 44L

  Editable reference:
  ------------------------------------------------
  minimumLowerAmount:
  - Lowest starting price the calculator can show.
  - Current: 4L.

  minimumRangeGap:
  - Minimum difference between lower and upper estimate.
  - Current: 3L.

  rangeGapPerBhk:
  - Extra upper range amount per BHK.
  - Current: 2L per BHK.

  packageRatePerBhk:
  - Main rate per BHK for each package.
  - Change these values to change estimated pricing.

  Currently NOT included in price calculation:
  ------------------------------------------------
  - Property Type: Apartment / Independent House
  - BHK Size: Below / Above sq.ft
  - Project Type: New Home / Renovation
  - Room counts: Living Room, Kitchen, Bedroom, Bathroom, Dining
  - Contact details

  These fields are collected for summary/contact only unless you add
  more formula logic in script.js.
*/

window.AJOR_HOME_CALCULATOR_CONFIG = {
  minimumLowerAmount: 4,
  minimumRangeGap: 3,
  rangeGapPerBhk: 2,
  packageRatePerBhk: {
    Standard: 4,
    Premium: 6,
    Luxe: 9,
  },
};
