import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import { rootReducer } from './reducers'
import rootSaga from './sagas'

const sagaMiddleware = createSagaMiddleware()

export const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware),
)

if (process.env.NODE_ENV !== 'production') {
  // Debug handle for the dev console only.
  window.store = store
}

sagaMiddleware.run(rootSaga)
