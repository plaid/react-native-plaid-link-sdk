const Types = require('./../Types');

test('test token configuration', () => {
    const linkTokenConfiguration = {
        token: "test-token",
        noLoadingState: false,
        logLevel: Types.LinkLogLevel.DEBUG,
        extras: null,
    };

    expect(linkTokenConfiguration.noLoadingState).toBe(false);
    expect(linkTokenConfiguration.token).toBe("test-token");
    expect(linkTokenConfiguration.logLevel).toBe(Types.LinkLogLevel.DEBUG);
    expect(linkTokenConfiguration.extras).toBe(null);
});