import { createPlaidLinkSession, createPlaidLayerSession } from '../index';
import NativePlaidModule from '../ReactNativePlaidLinkSdkModule';
import { LinkSuccess, LinkExit, LinkEvent, LinkEventName } from '../ReactNativePlaidLinkSdk.types';

describe('Listener Lifecycle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (NativePlaidModule as any).__clearListeners();
    (console.error as jest.Mock).mockClear();
    (console.log as jest.Mock).mockClear();
  });

  it('cleanupListeners removes all subscriptions', async () => {
    const config = {
      token: 'token-1',
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn()
    };

    await createPlaidLinkSession(config);
    
    expect((NativePlaidModule as any).__getListenerCount('onSuccess')).toBeGreaterThan(0);
    expect((NativePlaidModule as any).__getListenerCount('onExit')).toBeGreaterThan(0);
    expect((NativePlaidModule as any).__getListenerCount('onEvent')).toBeGreaterThan(0);

    const mockSuccess: LinkSuccess = {
      publicToken: 'token',
      metadata: {
        accounts: [],
        linkSessionId: 'session-1'
      }
    };

    (NativePlaidModule as any).__triggerEvent('onSuccess', mockSuccess);

    expect((NativePlaidModule as any).__getListenerCount('onSuccess')).toBe(0);
    expect((NativePlaidModule as any).__getListenerCount('onExit')).toBe(0);
    expect((NativePlaidModule as any).__getListenerCount('onEvent')).toBe(0);
  });

  it('multiple session creations do not stack listeners', async () => {
    const firstSuccess = jest.fn();
    const secondSuccess = jest.fn();

    const config1 = {
      token: 'token-1',
      onSuccess: firstSuccess,
      onExit: jest.fn(),
      onEvent: jest.fn()
    };

    await createPlaidLinkSession(config1);

    const config2 = {
      token: 'token-2',
      onSuccess: secondSuccess,
      onExit: jest.fn(),
      onEvent: jest.fn()
    };

    await createPlaidLinkSession(config2);

    const mockSuccess: LinkSuccess = {
      publicToken: 'token',
      metadata: {
        accounts: [],
        linkSessionId: 'session-2'
      }
    };

    (NativePlaidModule as any).__triggerEvent('onSuccess', mockSuccess);

    expect(firstSuccess).not.toHaveBeenCalled();
    expect(secondSuccess).toHaveBeenCalledTimes(1);
    expect(secondSuccess).toHaveBeenCalledWith(mockSuccess);
  });

  it('memory leak prevention with multiple sessions', async () => {
    const successCallbacks: jest.Mock[] = [];

    for (let i = 0; i < 10; i++) {
      const onSuccess = jest.fn();
      successCallbacks.push(onSuccess);

      const config = {
        token: `token-${i}`,
        onSuccess,
        onExit: jest.fn(),
        onEvent: jest.fn()
      };

      await createPlaidLinkSession(config);

      const mockSuccess: LinkSuccess = {
        publicToken: `public-token-${i}`,
        metadata: {
          accounts: [],
          linkSessionId: `session-${i}`
        }
      };

      (NativePlaidModule as any).__triggerEvent('onSuccess', mockSuccess);
    }

    expect((NativePlaidModule as any).__getListenerCount('onSuccess')).toBe(0);
    expect((NativePlaidModule as any).__getListenerCount('onExit')).toBe(0);
    expect((NativePlaidModule as any).__getListenerCount('onEvent')).toBe(0);

    successCallbacks.forEach((callback, index) => {
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  it('listeners are cleaned up after success', async () => {
    const onSuccess = jest.fn();
    const onExit = jest.fn();
    const onEvent = jest.fn();

    const config = {
      token: 'token',
      onSuccess,
      onExit,
      onEvent
    };

    await createPlaidLinkSession(config);

    const mockSuccess: LinkSuccess = {
      publicToken: 'token',
      metadata: {
        accounts: [],
        linkSessionId: 'session-1'
      }
    };

    (NativePlaidModule as any).__triggerEvent('onSuccess', mockSuccess);

    expect(onSuccess).toHaveBeenCalledTimes(1);

    const mockExit: LinkExit = {
      metadata: {
        linkSessionId: 'session-1',
        requestId: 'request-1'
      }
    };

    const mockEvent: LinkEvent = {
      eventName: LinkEventName.EXIT,
      metadata: {
        linkSessionId: 'session-1',
        viewName: 'EXIT' as any,
        timestamp: '2026-03-27T12:00:00Z',
        metadata_json: '{}'
      }
    };

    (NativePlaidModule as any).__triggerEvent('onExit', mockExit);
    (NativePlaidModule as any).__triggerEvent('onEvent', mockEvent);

    expect(onExit).not.toHaveBeenCalled();
    expect(onEvent).not.toHaveBeenCalled();
  });

  it('listeners are cleaned up after exit', async () => {
    const onSuccess = jest.fn();
    const onExit = jest.fn();
    const onEvent = jest.fn();

    const config = {
      token: 'token',
      onSuccess,
      onExit,
      onEvent
    };

    await createPlaidLinkSession(config);

    const mockExit: LinkExit = {
      metadata: {
        linkSessionId: 'session-1',
        requestId: 'request-1'
      }
    };

    (NativePlaidModule as any).__triggerEvent('onExit', mockExit);

    expect(onExit).toHaveBeenCalledTimes(1);

    const mockSuccess: LinkSuccess = {
      publicToken: 'token',
      metadata: {
        accounts: [],
        linkSessionId: 'session-1'
      }
    };

    const mockEvent: LinkEvent = {
      eventName: LinkEventName.OPEN,
      metadata: {
        linkSessionId: 'session-1',
        viewName: 'CONNECTED' as any,
        timestamp: '2026-03-27T12:00:00Z',
        metadata_json: '{}'
      }
    };

    (NativePlaidModule as any).__triggerEvent('onSuccess', mockSuccess);
    (NativePlaidModule as any).__triggerEvent('onEvent', mockEvent);

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onEvent).not.toHaveBeenCalled();
  });

  it('event listener persists during Link flow', async () => {
    const onEvent = jest.fn();

    const config = {
      token: 'token',
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent
    };

    await createPlaidLinkSession(config);

    const events: LinkEvent[] = [
      {
        eventName: LinkEventName.OPEN,
        metadata: {
          linkSessionId: 'session-1',
          viewName: 'CONNECTED' as any,
          timestamp: '2026-03-27T12:00:00Z',
          metadata_json: '{}'
        }
      },
      {
        eventName: LinkEventName.SELECT_INSTITUTION,
        metadata: {
          linkSessionId: 'session-1',
          viewName: 'SELECT_INSTITUTION' as any,
          timestamp: '2026-03-27T12:01:00Z',
          metadata_json: '{}'
        }
      },
      {
        eventName: LinkEventName.SUBMIT_CREDENTIALS,
        metadata: {
          linkSessionId: 'session-1',
          viewName: 'CREDENTIAL' as any,
          timestamp: '2026-03-27T12:02:00Z',
          metadata_json: '{}'
        }
      },
      {
        eventName: LinkEventName.SUBMIT_MFA,
        metadata: {
          linkSessionId: 'session-1',
          viewName: 'MFA' as any,
          timestamp: '2026-03-27T12:03:00Z',
          metadata_json: '{}'
        }
      },
      {
        eventName: LinkEventName.TRANSITION_VIEW,
        metadata: {
          linkSessionId: 'session-1',
          viewName: 'CONNECTED' as any,
          timestamp: '2026-03-27T12:04:00Z',
          metadata_json: '{}'
        }
      }
    ];

    events.forEach(event => {
      (NativePlaidModule as any).__triggerEvent('onEvent', event);
    });

    expect(onEvent).toHaveBeenCalledTimes(5);
    events.forEach((event, index) => {
      expect(onEvent).toHaveBeenNthCalledWith(index + 1, event);
    });

    expect((NativePlaidModule as any).__getListenerCount('onEvent')).toBeGreaterThan(0);
  });

  it('layer session listeners clean up after success', async () => {
    const onSuccess = jest.fn();
    const onExit = jest.fn();

    const config = {
      token: 'layer-token',
      onSuccess,
      onExit
    };

    await createPlaidLayerSession(config);

    const mockSuccess: LinkSuccess = {
      publicToken: 'token',
      metadata: {
        accounts: [],
        linkSessionId: 'session-1'
      }
    };

    (NativePlaidModule as any).__triggerEvent('onSuccess', mockSuccess);

    expect(onSuccess).toHaveBeenCalledTimes(1);

    (NativePlaidModule as any).__triggerEvent('onExit', {});
    expect(onExit).not.toHaveBeenCalled();
  });

  it('switching between link and layer sessions cleans up properly', async () => {
    const linkSuccess = jest.fn();
    const layerSuccess = jest.fn();

    const linkConfig = {
      token: 'link-token',
      onSuccess: linkSuccess,
      onExit: jest.fn(),
      onEvent: jest.fn()
    };

    await createPlaidLinkSession(linkConfig);

    const layerConfig = {
      token: 'layer-token',
      onSuccess: layerSuccess
    };

    await createPlaidLayerSession(layerConfig);

    const mockSuccess: LinkSuccess = {
      publicToken: 'token',
      metadata: {
        accounts: [],
        linkSessionId: 'session-1'
      }
    };

    (NativePlaidModule as any).__triggerEvent('onSuccess', mockSuccess);

    expect(linkSuccess).not.toHaveBeenCalled();
    expect(layerSuccess).toHaveBeenCalledTimes(1);
  });
});
