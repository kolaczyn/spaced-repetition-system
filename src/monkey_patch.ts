// @ts-expect-error: we're monkey patching toJSON, so obviously toJSON is not defined on the type
BigInt.prototype.toJSON = function () {
  return this.toString();
};
