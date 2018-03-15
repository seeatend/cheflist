import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './app/app'
import registerServiceWorker from './registerServiceWorker'
import store from './app/store'

import { addLocaleData, IntlProvider } from 'react-intl'
import en from 'react-intl/locale-data/en'
import de from 'react-intl/locale-data/de'
import { flattenMessages } from './utils'
import messages from './messages'

addLocaleData([...en, ...de])

let locale =
	(navigator.languages && navigator.languages[0])
	|| navigator.language
	|| navigator.userLanguage
	|| 'en-US';

ReactDOM.render(
	<Provider store={store}>
		<IntlProvider locale={locale} messages={flattenMessages(messages[locale])}>
			<App />
		</IntlProvider>
	</Provider>,
	document.getElementById('root')
);

registerServiceWorker();