import { MockedProvider, MockedResponse } from '@apollo/react-testing';
import {
  fireEvent,
  getByTestId,
  render,
  RenderResult,
  waitForElement
} from '@testing-library/react';
import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AnyAction } from 'redux';
import { menuOpen } from 'src/actions/layout/menuOpen';
import {
  defaultStateCreator,
  TState
} from 'src/components/provider.test/defaultStateCreator';
import { MockReduxProvider } from 'src/components/provider.test/MockReduxProvider';
import {
  mockStoreCreator,
  TMockStore
} from 'src/components/provider.test/mockStoreCreator';
import * as getTheme from 'src/gql/theme/getTheme.gql';
import { Menu } from './Menu';

describe('Menu component', () => {
  let rr: RenderResult;
  let initialState: TState;
  let mockStore: TMockStore;
  // graphql mocked response
  const mocks: MockedResponse[] = [
    {
      request: {
        query: getTheme
      },
      result: {
        data: {
          theme: {
            headerMenu: {
              label: 'header-menu-1/label',
              menuEntries: [
                {
                  _id: 'menu-entry-1/_id',
                  label: 'menu-entry-1/label',
                  url: 'menu-entry-1/url'
                },
                {
                  _id: 'menu-entry-2/_id',
                  label: 'menu-entry-2/label',
                  url: 'menu-entry-2/url'
                }
              ]
            }
          }
        }
      }
    }
  ];

  /**
   * returns a promise which gets resolved when the loading ends
   * which also signifies that the useQuery->MockedProvider->Promise
   * has been resolved...
   *
   * important: we must resolve that promise
   *  before we exit each test that initiates it.
   *  Meaning, it must run "onBeforeEach" or "onAfterEach"
   *  in the scope that it is pending...
   */
  const waitForLoadingToEnd: () => Promise<
    HTMLElement
  > = (): Promise<HTMLElement> =>
    waitForElement(() => getByTestId(rr.container, 'menu-button'), {
      container: rr.container
    });

  /**
   * renders the component and returns the rendered result.
   * it makes sure that all the relative providers are there
   * (ie. router, redux store, graphql, etc.)
   *
   * @param store the redux-mock-store to use in the redux store provider
   */
  const renderComponent: (store: TMockStore) => RenderResult = (
    store: TMockStore
  ): RenderResult =>
    render(
      <MemoryRouter>
        <MockReduxProvider store={store}>
          <MockedProvider mocks={mocks} addTypename={false} cache={undefined}>
            <Menu />
          </MockedProvider>
        </MockReduxProvider>
      </MemoryRouter>
    );

  describe('with default state', () => {
    beforeEach(() => {
      mockStore = mockStoreCreator();
      rr = renderComponent(mockStore);
    });

    describe('while loading', () => {
      afterEach(waitForLoadingToEnd);

      it('renders nothing', async () => {
        expect(rr.container.firstChild).toBeNull();
      });
    });

    describe('on successful load', () => {
      beforeEach(waitForLoadingToEnd);

      describe('menu button', () => {
        let el: HTMLElement;
        beforeEach(() => {
          el = getByTestId(rr.container, 'menu-button');
        });

        it('gets rendered', () => {
          expect(el).toBeDefined();
        });

        describe('click event', () => {
          let actions: AnyAction[];

          beforeEach(() => {
            mockStore.clearActions();
            fireEvent.click(el);
            actions = mockStore.getActions();
          });

          it('dispatches the MENU_OPEN action with payload:true', () => {
            expect(actions).toHaveLength(1);
            expect(actions[0]).toStrictEqual(menuOpen(true));
          });
        });
      });
    });
  });

  describe('with state.layout.menuOpen:true', () => {
    beforeEach(() => {
      initialState = defaultStateCreator();
      initialState.layout.menuOpen = true;
      mockStore = mockStoreCreator(initialState);
      rr = renderComponent(mockStore);
    });

    describe('while loading', () => {
      afterEach(waitForLoadingToEnd);

      it('renders nothing', async () => {
        expect(rr.container.firstChild).toBeNull();
      });
    });

    describe('on successful load', () => {
      beforeEach(waitForLoadingToEnd);

      describe('menu button', () => {
        let el: HTMLElement;
        beforeEach(() => {
          el = getByTestId(rr.container, 'menu-button');
        });

        it('gets rendered', () => {
          expect(el).toBeDefined();
        });

        describe('click event', () => {
          let actions: AnyAction[];

          beforeEach(() => {
            mockStore.clearActions();
            fireEvent.click(el);
            actions = mockStore.getActions();
          });

          it('dispatches the MENU_OPEN action with payload:false', () => {
            expect(actions).toHaveLength(1);
            expect(actions[0]).toStrictEqual(menuOpen(false));
          });
        });
      });
    });
  });
});
