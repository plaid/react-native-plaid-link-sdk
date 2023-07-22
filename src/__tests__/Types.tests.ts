const Types = require('./../Types');

test('something', () => {
    const linkTokenConfiguration = {
        token: "test-token",
        noLoadingState: false,
        logLevel: Types.LinkLogLevel.DEBUG,
    };

    expect(linkTokenConfiguration.noLoadingState).toBe(false);
    expect(linkTokenConfiguration.token).toBe("test-token");
    expect(linkTokenConfiguration.logLevel).toBe(Types.LinkLogLevel.DEBUG);
});