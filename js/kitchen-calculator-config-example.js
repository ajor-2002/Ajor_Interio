/*
  Ajor Interio - Kitchen Calculator Example Formula
  ------------------------------------------------
  This is an example file showing how the Kitchen Calculator can be
  calculated in the same style as js/home-calculator-config.js.

  This file is not connected to the live website yet.
  Use it as a pricing reference or connect it later from script.js.

  All amount values below are in rupees unless the name says "lakhs".


  FULL FORMULA
  ------------------------------------------------

  Step 1: Read user selections
  - City
  - Home configuration: 1 BHK, 2 BHK, 3 BHK, 4 BHK
  - Kitchen shape: L-Shape, U-Shape, Parallel, Straight
  - Wall A/B/C dimensions in feet and inches
  - Cabinet material
  - Shutter material and finish
  - Accessories and quantities

  Step 2: Convert wall measurements into running feet
  runningFeet =
    Wall A feet + Wall A inches / 12
    + Wall B feet + Wall B inches / 12
    + Wall C feet + Wall C inches / 12

  Example:
  Wall A = 10ft 0in
  Wall B = 5ft 0in
  Wall C = 5ft 0in
  runningFeet = 10 + 5 + 5 = 20 running feet

  Step 3: Get base rate for selected kitchen shape
  Example:
  L-Shape = Rs. 9500 per running foot

  Step 4: Calculate cabinet base amount
  baseKitchenAmount = runningFeet x shapeRatePerRunningFoot

  Example:
  20 running feet x Rs. 9500 = Rs. 1,90,000

  Step 5: Apply material multipliers
  materialAdjustedAmount =
    baseKitchenAmount
    x cabinetMaterialMultiplier
    x shutterFinishMultiplier

  Example:
  Plywood multiplier = 1.28
  Acrylic multiplier = 1.35
  materialAdjustedAmount = 1,90,000 x 1.28 x 1.35 = Rs. 3,28,320

  Step 6: Add accessories
  accessoryAmount =
    accessory quantity x accessory rate

  Example:
  Bottle pull-out x 1 = Rs. 14,000
  Cutlery tray x 1 = Rs. 8,000
  Tandem drawer x 2 = Rs. 36,000
  accessoryAmount = Rs. 58,000

  Step 7: Apply city and BHK multipliers
  adjustedAmount =
    (materialAdjustedAmount + accessoryAmount)
    x cityMultiplier
    x bhkMultiplier

  Step 8: Apply minimum lower amount
  lowerAmount = max(minimumKitchenAmount, adjustedAmount)

  Step 9: Calculate upper estimate
  rangeGap = max(minimumRangeGap, lowerAmount x rangePercent)
  upperAmount = lowerAmount + rangeGap

  Step 10: Round and display
  Result = Rs. lowerAmount - Rs. upperAmount


  WORKED EXAMPLE
  ------------------------------------------------
  User selects:
  - City: Bengaluru
  - BHK: 2 BHK
  - Shape: L-Shape
  - Wall A: 10ft 0in
  - Wall B: 5ft 0in
  - Wall C: 5ft 0in
  - Cabinet material: Plywood
  - Shutter finish: Acrylic
  - Accessories:
    - Bottle pull-out: 1
    - Cutlery cup & saucer thali tray: 1
    - Tandem drawer: 2

  Calculation:
  runningFeet = 20
  shapeRate = Rs. 9500
  baseKitchenAmount = 20 x 9500 = Rs. 1,90,000

  materialAdjustedAmount =
    1,90,000 x 1.28 x 1.35
    = Rs. 3,28,320

  accessoryAmount =
    14,000 + 8,000 + 36,000
    = Rs. 58,000

  cityMultiplier = 1.08
  bhkMultiplier = 1.03

  adjustedAmount =
    (3,28,320 + 58,000) x 1.08 x 1.03
    = Rs. 4,29,765

  lowerAmount = max(1,50,000, 4,29,765) = Rs. 4,29,765
  rangeGap = max(35,000, 4,29,765 x 0.12) = Rs. 51,572
  upperAmount = 4,29,765 + 51,572 = Rs. 4,81,337

  Rounded result:
  Rs. 4,30,000 - Rs. 4,81,000
*/

window.AJOR_KITCHEN_CALCULATOR_CONFIG_EXAMPLE = {
  minimumKitchenAmount: 150000,
  minimumRangeGap: 35000,
  rangePercent: 0.12,

  shapeRatePerRunningFoot: {
    'Straight': 8200,
    'L-Shape': 9500,
    'Parallel': 10500,
    'U-Shape': 11800,
  },

  cabinetMaterialMultiplier: {
    'Particle Board': 1,
    MDF: 1.12,
    'HDF-HMR': 1.2,
    Plywood: 1.28,
  },

  shutterFinishMultiplier: {
    'Particle Board Matte Laminate': 1,
    Acrylic: 1.35,
    Membrane: 1.22,
    'PU Finish': 1.45,
  },

  bhkMultiplier: {
    '1 BHK': 1,
    '2 BHK': 1.03,
    '3 BHK': 1.06,
    '4 BHK': 1.1,
  },

  cityMultiplier: {
    default: 1,
    Bengaluru: 1.08,
    Chennai: 1.06,
    Hyderabad: 1.06,
    Kochi: 1.04,
    Ahmedabad: 1.03,
  },

  accessoryRate: {
    'Detergent holder & bin holder designs': 12000,
    'Detergent holder (350mm) designs': 6500,
    'Cutlery cup & saucer thali tray designs': 8000,
    'Bottle pull-out (300mm soft-close channels) designs': 14000,
    'Tandem drawer (soft-close channels without gallery ) designs': 18000,
    'Microwave and otg provision with one shelf and one drawer designs': 22000,
    'Pantry pullout designs': 30000,
    'Larder pull out designs': 32000,
    'Pull out baskets designs': 15000,
    'Worktop extension designs': 18000,
    'Wicker basket (600mm) designs': 9000,
    'Lemans corner designs': 42000,
    'Magic corner designs': 38000,
    'D tray designs': 16000,
    'Plate tray glass tray (600mm) designs': 9500,
    'Plain basket(600mm soft-close channels) designs': 7500,
  },
};

/*
  Example JavaScript function for using the config:

  function calculateKitchenEstimate(input) {
    const config = window.AJOR_KITCHEN_CALCULATOR_CONFIG_EXAMPLE;
    const runningFeet = input.walls.reduce((sum, wall) => {
      return sum + Number(wall.feet || 0) + Number(wall.inches || 0) / 12;
    }, 0);

    const shapeRate = config.shapeRatePerRunningFoot[input.shape] || config.shapeRatePerRunningFoot['L-Shape'];
    const cabinetMultiplier = config.cabinetMaterialMultiplier[input.cabinetMaterial] || 1;
    const shutterMultiplier = config.shutterFinishMultiplier[input.shutterFinish] || 1;
    const bhkMultiplier = config.bhkMultiplier[input.bhk] || 1;
    const cityMultiplier = config.cityMultiplier[input.city] || config.cityMultiplier.default;

    const baseKitchenAmount = runningFeet * shapeRate;
    const materialAdjustedAmount = baseKitchenAmount * cabinetMultiplier * shutterMultiplier;
    const accessoryAmount = input.accessories.reduce((sum, accessory) => {
      const rate = config.accessoryRate[accessory.name] || 0;
      return sum + rate * Number(accessory.quantity || 0);
    }, 0);

    const adjustedAmount = (materialAdjustedAmount + accessoryAmount) * cityMultiplier * bhkMultiplier;
    const lowerAmount = Math.max(config.minimumKitchenAmount, adjustedAmount);
    const rangeGap = Math.max(config.minimumRangeGap, lowerAmount * config.rangePercent);
    const upperAmount = lowerAmount + rangeGap;

    return {
      runningFeet,
      lowerAmount: Math.round(lowerAmount),
      upperAmount: Math.round(upperAmount),
    };
  }
*/
