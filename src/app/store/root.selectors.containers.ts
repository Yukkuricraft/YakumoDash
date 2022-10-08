import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RootState } from "@app/store/root.state";
import { Features } from "@app/store/index";
import { Env } from "@app/models/env";
import {
	ActiveContainer,
	ContainerDefinition,
	ContainerType,
} from "@app/models/container";
import _ from "lodash";

const selectRootState = createFeatureSelector<RootState>(Features.Root);

/** Active Containers */
export const selectActiveContainersByEnv = (env: Env) =>
	createSelector(
		selectRootState,
		state => state.activeContainersByEnv[env.name] || []
	);

export const selectActiveContainersByEnvAndType = (
	env: Env,
	type: ContainerType
) =>
	createSelector(selectRootState, state => {
		const containersInEnv = state.activeContainersByEnv[env.name];
		if (!containersInEnv || !_.has(containersInEnv, type)) {
			return [];
		}
		return containersInEnv[type];
	});

export const selectActiveContainerByContainerDef = (
	containerDef: ContainerDefinition
) => {
	const envString = containerDef.getContainerEnvString();
	const type = containerDef.getContainerType();
	const name = containerDef.getContainerName();

	return createSelector(
		selectActiveContainerByEnvTypeAndName(
			{ name: envString } as Env,
			type,
			name
		),
		container => container
	);
};

export const selectActiveContainerByEnvTypeAndName = (
	env: Env,
	type: ContainerType,
	name: string
) =>
	createSelector(selectActiveContainersByEnvAndType(env, type), containers => {
		if (_.isNil(containers)) {
			return null;
		}
		for (let container of containers) {
			if (_.includes(container.labels, `${container.NameLabel}=${name}`)) {
				return container;
			}
		}
		return null;
	});

/** Defined Containers */
export const selectDefinedContainersByEnv = (env: Env) =>
	createSelector(
		selectRootState,
		state => state.definedContainersByEnv[env.name] || []
	);

export const selectDefinedContainersByEnvAndType = (
	env: Env,
	type: ContainerType
) =>
	createSelector(
		selectRootState,
		state => (state.definedContainersByEnv[env.name] ?? {})[type]
	);
