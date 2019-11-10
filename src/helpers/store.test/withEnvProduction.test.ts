import { Action, Store, StoreCreator } from 'redux';
import {
  dummyMiddleware,
  TDummyMiddleware,
  TDummyMiddlewareMockedFn
} from './dummyMiddleware';

describe('store object', () => {
  let oldEnv: string | undefined;
  let store: Store;
  type TComposeEnhancer = (next: StoreCreator) => StoreCreator;
  let composeWithDevTools: () => jest.MockedFunction<TComposeEnhancer>;
  let dMiddlewareSpy: TDummyMiddlewareMockedFn;
  let dMiddleware: TDummyMiddleware;

  beforeAll(() => {
    oldEnv = process.env.NODE_ENV;
  });
  beforeEach(() => {
    jest.resetModules();

    // initialize the dummy middleware and its spy
    dMiddlewareSpy = jest.fn();
    dMiddleware = dummyMiddleware(dMiddlewareSpy);

    // mock the index reducer, so that our tests stay the same
    // in the future, as we modify the reducers/store
    jest.mock('src/reducers/index', () => ({
      index: jest.fn().mockReturnValue({
        testReducer: true
      })
    }));

    // mock the storeMiddlewares, since we want an isolated test here
    // of just the store with its StoreEnhancer
    jest.mock('src/helpers/storeMiddlewares', () => ({
      storeMiddlewares: []
    }));
  });
  afterAll(() => {
    process.env.NODE_ENV = oldEnv;
  });

  describe('with process.env.NODE_ENV:"production"', () => {
    beforeEach(async () => {
      process.env.NODE_ENV = 'production';
    });

    describe('with "composeEnhancers" returning a function', () => {
      beforeEach(() => {
        //
        // mock the redux-devtools-extension, so that we can test
        // if it gets used or not, without caring of what it does
        //
        // use our dummy middleware which we can spy if it gets invoked
        // when an action gets dispatched to the store
        composeWithDevTools = jest
          .fn()
          .mockImplementation((): TDummyMiddleware => dMiddleware);
        jest.mock('redux-devtools-extension', () => ({
          composeWithDevTools
        }));
      });

      beforeEach(async () => {
        ({ store } = await import('src/helpers/store'));
      });

      it('is an object', () => {
        expect(store).toBeInstanceOf(Object);
      });

      describe('"getState" method', () => {
        it('exists', () => {
          expect(store.getState).toBeInstanceOf(Function);
        });

        it('returns the state object', () => {
          expect(store.getState()).toStrictEqual({
            testReducer: true
          });
        });
      });

      describe('"dispatch" method', () => {
        it('exists', () => {
          expect(store.dispatch).toBeInstanceOf(Function);
        });

        describe('called', () => {
          let result: Action;
          beforeEach(() => {
            result = store.dispatch({ type: 'TEST_ACTION_TYPE' });
          });
          it('returns the action passed, when called', () => {
            expect(result).toStrictEqual({
              type: 'TEST_ACTION_TYPE'
            });
          });

          it('does not invoke the dummyMiddlewareSpy', () => {
            expect(dMiddlewareSpy).not.toHaveBeenCalled();
          });
        });
      });

      it('is has the "subscribe" method', () => {
        expect(store.subscribe).toBeInstanceOf(Function);
      });

      it('is has the "replaceReducer" method', () => {
        expect(store.replaceReducer).toBeInstanceOf(Function);
      });
    });
  });
});
