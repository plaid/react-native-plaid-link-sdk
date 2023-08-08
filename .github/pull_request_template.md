## Summary
<!-- Simple summary of what was changed. -->

## Motivation
<!-- Why are you making this change? If it's for fixing a bug, if possible, please include a link to the relevant issue, a code snippet, or an example project that demonstrates the bug. -->

## :pencil: Checklist
- [ ] I have performed a self-review of my own code.
- [ ] I have optimized code readability (class/variable names, straight forward logic paths, short clarifying docs,...).

## :green_heart: Testing
<!--- Explain how to test your changes -->
- [ ] I have manually tested my changes.


## Documentation

Select one:
 
- [ ] I have added relevant documentation for my changes.
- [ ] This PR does not result in any developer-facing changes.

## Reminder

If you made changes to typescript or javascript you'll need to update the JS bundle in the example app for tests on CI to pass. You'll need to have the SDK copied locally and then run:
`react-native bundle --entry-file='index.js' --bundle-output='./ios/main.jsbundle' --dev=false --platform='ios' --assets-dest='./ios'`
