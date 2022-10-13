// noinspection JSUnusedGlobalSymbols

const Decimal = require("decimal.js");
const ValidationResult = require("./validation-result");

/**
 * Matcher validates that string value represents a decimal number or null.
 * Decimal separator is always "."
 * In addition, it must comply to the rules described below.
 *
 * @param params - Matcher can take 0 to 2 parameters with following rules:
 * - no parameters: validates that number of digits does not exceed the maximum value of 11.
 * - one parameter: the parameter specifies maximum length of number for the above rule (parameter replaces the default value of 11)
 * - two parameters:
 *   -- first parameter represents the total maximum number of digits,
 *   -- the second parameter represents the maximum number of decimal places.
 *   -- both conditions must be met in this case.
 */
class DecimalNumberMatcher {
  constructor(...params) {
    this.params = params;
  }

  match(value) {
    const ERRORS = {
      INVALID_DECIMAL: {
        code: "doubleNumber.e001",
        message: "The value is not a valid decimal number."
      },
      DIGITS_EXCEEDED: {
        code: "doubleNumber.e002",
        message: "The value exceeded maximum number of digits."
      },
      DECIMALS_EXCEEDED: {
        code: "doubleNumber.e003",
        message: "The value exceeded maximum number of decimal places."
      }
    }

    function throwError(error) {
      result.addInvalidTypeError(error.code, error.message);
      return result;
    }

    const DEFAULT_MAX_DIGITS = 11;
    const maxDigits = this.params[0] || DEFAULT_MAX_DIGITS;
    const maxDecimals = this.params[1];

    let result = new ValidationResult();

    if (value == null) {
      return result;
    }

    let number;
    try {
      number = new Decimal(value);
    } catch (e) {
      throwError(ERRORS.INVALID_DECIMAL);
    }
    if (number?.precision(true) > maxDigits) {
      throwError(ERRORS.DIGITS_EXCEEDED);
    }
    if (maxDigits && number?.decimalPlaces() > maxDecimals) {
      throwError(ERRORS.DECIMALS_EXCEEDED);
    }
    return result;
  }
}

module.exports = DecimalNumberMatcher;
