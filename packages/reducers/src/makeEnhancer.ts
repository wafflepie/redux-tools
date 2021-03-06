/* eslint-disable no-use-before-define */
import {
	identity,
	pluck,
	juxt,
	difference,
	reduce,
	dissocPath,
	head,
	isEmpty,
	path,
	reduced,
	tail,
} from 'ramda';
import type { Reducer, StoreEnhancer } from 'redux';

import {
	enhanceStore,
	makeStoreInterface,
	Injectables,
	InjectorStore,
	InjectorCallbackPayload,
} from '@redux-syringe/injectors';
import { DEFAULT_FEATURE } from '@redux-syringe/namespaces';

import { combineReducerEntries } from './combineReducerEntries';
import { composeReducers } from './composeReducers';
import { ReducerKey } from './types';

export const storeInterface = makeStoreInterface<Reducer, 'reducers'>('reducers');

export type ReducersEnhancer = StoreEnhancer<InjectorStore<Reducer, typeof storeInterface>>;

export interface ReducersEnhancerOptions {
	initialReducers?: Injectables<Reducer>;
}

const cleanupReducer: Reducer = (state, action) => {
	if (action.type !== '@redux-syringe/CLEAN_UP_STATE') {
		return state;
	}

	return reduce<ReducerKey[], any>(
		(previousState, pathDefinition) => {
			const fullPathDefinition: ReducerKey[] = [
				...(action.meta.namespace ? [action.meta.feature ?? DEFAULT_FEATURE] : []),
				...(action.meta.namespace ? [action.meta.namespace] : []),
				...pathDefinition,
			];

			// GIVEN: fullPathDefinition = ['a', 'b', 'c']
			// THEN: partialPathDefinitions = [['a', 'b', 'c'], ['a', 'b'], ['a']]
			const partialPathDefinitions = reduce<ReducerKey, ReducerKey[][]>(
				(previousPartialPathDefinitions, key) => [
					[...(head(previousPartialPathDefinitions) ?? []), key],
					...previousPartialPathDefinitions,
				],
				[],
				fullPathDefinition
			);

			return reduce(
				(populatedState, partialPathDefinition) =>
					isEmpty(path(partialPathDefinition, populatedState))
						? dissocPath(partialPathDefinition, populatedState)
						: reduced(populatedState),
				// NOTE: `dissocPath` and `tail` are used here to kick-start the cascading process.
				dissocPath(fullPathDefinition, previousState),
				tail(partialPathDefinitions)
			);
		},
		state,
		action.payload
	);
};

export const makeEnhancer =
	({ initialReducers }: ReducersEnhancerOptions = {}): ReducersEnhancer =>
	createStore =>
	(reducer: any = identity, ...args: any[]): any => {
		const prevStore = createStore(reducer, ...args);

		const handleEntriesChanged = (): void =>
			nextStore.replaceReducer(
				composeReducers(
					reducer,
					combineReducerEntries(storeInterface.getEntries(nextStore)),
					cleanupReducer
				)
			);

		const handleEjected = ({ entries, props }: InjectorCallbackPayload<Reducer>) => {
			const nextEntries = storeInterface.getEntries(nextStore);
			const fullyEjectedEntries = difference(entries, nextEntries);

			nextStore.dispatch({
				type: '@redux-syringe/CLEAN_UP_STATE',
				payload: pluck('path', fullyEjectedEntries),
				meta: props,
			});
		};

		const nextStore = enhanceStore(prevStore, storeInterface, {
			onInjected: handleEntriesChanged,
			onEjected: juxt([handleEntriesChanged, handleEjected]),
		});

		if (initialReducers) {
			nextStore.injectReducers(initialReducers);
		}

		return nextStore;
	};
