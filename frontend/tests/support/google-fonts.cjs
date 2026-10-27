// Test-only font responses keep the dev server independent of external networks.
module.exports = new Proxy({}, {
  get: () => '@font-face { font-family: "TestFont"; src: local("Arial"); font-style: normal; font-weight: 100 900; }',
});
