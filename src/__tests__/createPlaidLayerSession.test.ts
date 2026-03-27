import { createPlaidLayerSession } from '../index';
import NativePlaidModule from '../ReactNativePlaidLinkSdkModule';
import { LinkSuccess, LinkExit, LinkEvent, LinkEventName } from '../ReactNativePlaidLinkSdk.types';

describe('createPlaidLayerSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (NativePlaidModule as any).__clearListeners();
    (console.error as jest.Mock).mockClear();
    (console.log as jest.Mock).mockClear();
  });

  it('creates layer session with valid token and callbacks', async () => {
    const config = {
      token: 'layer-token-123',
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn()
    };

    const session = await createPlaidLayerSession(config);

    expect(NativePlaidModule.createPlaidLayerSession).toHaveBeenCalledWith('layer-token-123');
    expect(session).toHaveProperty('open');
    expect(session).toHaveProperty('submit');
    expect(typeof session.open).toBe('function');
    expect(typeof session.submit).toBe('function');
    expect(NativePlaidModule.addListener).toHaveBeenCalledTimes(3);
  });

  it('handles optional onExit callback', async () => {
    const configWithoutExit = {
      token: 'layer-token',
      onSuccess: jest.fn()
    };

    const session1 = await createPlaidLayerSession(configWithoutExit);
    expect(session1).toBeDefined();

    const onExitMock = jest.fn();
    const configWithExit = {
      token: 'layer-token',
      onSuccess: jest.fn(),
      onExit: onExitMock
    };

    await createPlaidLayerSession(configWithExit);

    const mockExit: LinkExit = {
      metadata: {
        linkSessionId: 'session-123',
        requestId: 'request-123'
      }
    };

    (NativePlaidModule as any).__triggerEvent('onExit', mockExit);
    expect(onExitMock).toHaveBeenCalledWith(mockExit);
  });

  it('handles optional onEvent callback', async () => {
    const configWithoutEvent = {
      token: 'layer-token',
      onSuccess: jest.fn()
    };

    const session1 = await createPlaidLayerSession(configWithoutEvent);
    expect(session1).toBeDefined();

    const onEventMock = jest.fn();
    const configWithEvent = {
      token: 'layer-token',
      onSuccess: jest.fn(),
      onEvent: onEventMock
    };

    await createPlaidLayerSession(configWithEvent);

    const mockEvent: LinkEvent = {
      eventName: LinkEventName.LAYER_READY,
      metadata: {
        linkSessionId: 'session-123',
        viewName: 'CONNECTED' as any,
        timestamp: '2026-03-27T12:00:00Z',
        metadata_json: '{}'
      }
    };

    (NativePlaidModule as any).__triggerEvent('onEvent', mockEvent);
    expect(onEventMock).toHaveBeenCalledWith(mockEvent);
  });

  it('submit method passes correct parameters', async () => {
    const config = {
      token: 'layer-token',
      onSuccess: jest.fn()
    };

    const session = await createPlaidLayerSession(config);

    await session.submit({ phoneNumber: '555-1234' });
    expect(NativePlaidModule.submitLayerData).toHaveBeenCalledWith('555-1234', undefined, undefined);

    await session.submit({ dateOfBirth: '1990-01-01' });
    expect(NativePlaidModule.submitLayerData).toHaveBeenCalledWith(undefined, '1990-01-01', undefined);

    await session.submit({ params: { foo: 'bar', baz: 'qux' } });
    expect(NativePlaidModule.submitLayerData).toHaveBeenCalledWith(undefined, undefined, { foo: 'bar', baz: 'qux' });

    await session.submit({
      phoneNumber: '555-9999',
      dateOfBirth: '1985-12-25',
      params: { key: 'value' }
    });
    expect(NativePlaidModule.submitLayerData).toHaveBeenCalledWith('555-9999', '1985-12-25', { key: 'value' });
  });

  it('onSuccess triggers and cleans up listeners', async () => {
    const onSuccessMock = jest.fn();
    const onExitMock = jest.fn();

    const config = {
      token: 'layer-token',
      onSuccess: onSuccessMock,
      onExit: onExitMock
    };

    await createPlaidLayerSession(config);

    const mockSuccess: LinkSuccess = {
      publicToken: 'public-token-456',
      metadata: {
        accounts: [],
        linkSessionId: 'session-456'
      }
    };

    (NativePlaidModule as any).__triggerEvent('onSuccess', mockSuccess);

    expect(onSuccessMock).toHaveBeenCalledWith(mockSuccess);
    
    (NativePlaidModule as any).__triggerEvent('onExit', {});
    expect(onExitMock).not.toHaveBeenCalled();
  });

  it('returns session with working open method', async () => {
    const config = {
      token: 'layer-token',
      onSuccess: jest.fn()
    };

    const session = await createPlaidLayerSession(config);

    await session.open();
    expect(NativePlaidModule.openLayerSession).toHaveBeenCalled();
    expect(NativePlaidModule.openLayerSession).toHaveBeenCalledTimes(1);
  });

  it('handles errors from native module', async () => {
    const mockError = new Error('Layer session creation failed');
    (NativePlaidModule.createPlaidLayerSession as jest.Mock).mockRejectedValueOnce(mockError);

    const config = {
      token: 'layer-token',
      onSuccess: jest.fn()
    };

    await expect(createPlaidLayerSession(config)).rejects.toThrow('Layer session creation failed');
    expect(console.error).toHaveBeenCalledWith('[PlaidLink] createPlaidLayerSession failed:', mockError);
  });
});
