describe('filterReducer', () => {
	const state = { foo: 'bar' };
	const newState = { bar: 'baz' };

	beforeEach(() => jest.resetModules());

	it('calls reducer when namespace matches', () => {
		jest.doMock('@redux-syringe/namespaces', () => ({
			isActionFromNamespace: jest.fn(() => true),
		}));

		// eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
		const { filterReducer } = require('./filterReducer');
		const reducer = jest.fn(() => newState);

		expect(filterReducer(reducer, 'matchedNamespace')(state, {})).toBe(newState);
		expect(reducer).toHaveBeenCalledWith(state, {});
	});

	it('does not call reducer when namespace does not match', () => {
		jest.doMock('@redux-syringe/namespaces', () => ({
			isActionFromNamespace: jest.fn(() => false),
		}));

		// eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
		const { filterReducer } = require('./filterReducer');
		const reducer = jest.fn(() => newState);

		expect(filterReducer(reducer, 'randomNamespace')(state, {})).toBe(state);
		expect(reducer).not.toHaveBeenCalled();
	});
});
