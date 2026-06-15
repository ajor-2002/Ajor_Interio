/*
  Ajor Interio - Kitchen Calculator Formula
  -----------------------------------------
  Premium running-foot based pricing with package, material, countertop,
  accessory and city adjustments.

  Formula:
    Final Kitchen Cost =
      ((Running Feet x Shape Rate x Material Multipliers)
      + Countertop Cost
      + Accessories)
      x City Multiplier

  Notes:
  - BHK is intentionally not used in the final estimate.
  - Countertop cost is shown separately.
  - Package controls the base running-foot rate.
*/

window.AJOR_KITCHEN_CALCULATOR_CONFIG = {
  rangePercent: 0.15,

  shapeRatePerRunningFoot: {
    Straight: {
      Standard: 9000,
      Premium: 11000,
      Luxury: 14000,
    },
    Parallel: {
      Standard: 10000,
      Premium: 12500,
      Luxury: 15500,
    },
    'L-Shape': {
      Standard: 11000,
      Premium: 13500,
      Luxury: 17000,
    },
    'U-Shape': {
      Standard: 12000,
      Premium: 15000,
      Luxury: 18500,
    },
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

  countertopRate: {
    granite: 450,
    quartz: 900,
    italianMarble: 1400,
  },

  cityMultiplier: {
    default: 1,
    Bengaluru: 1.05,
    Chennai: 1.04,
    Hyderabad: 1.04,
    Kochi: 1.03,
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
