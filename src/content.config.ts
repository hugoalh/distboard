import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z as zod } from "astro/zod";
import type { TargetMapComponent } from "./components/build.js";
/*
const zodTargetNPMForgejo = zod.stringFormat("target-npm-forgejo", /^(?:@[\da-z\-._~]+?\/)?[\da-z\-._~]+?$/);
const zodTargetNPMNPM = zod.stringFormat("target-npm-npm", /^(?:@[\da-z\-._~]+?\/)?[\da-z\-._~]+?$/);
const zodTargetRepository = zod.stringFormat("target-repository", /^[\d\w\-.]+?\/[\d\w\-.]+?(?:\/[\d\w\-.]+?)*$/);
*/
type TargetRemapHandler = (item: URLPatternResult) => TargetMapComponent;
const targetsRemap: Map<URLPattern, TargetRemapHandler> = new Map<URLPattern, TargetRemapHandler>([
	[
		new URLPattern({
			hostname: "codeberg.org",
			pathname: "/:owner/:name",
			protocol: "http{s}?"
		}),
		({ pathname }: URLPatternResult): TargetMapComponent => {
			const name: string = `${pathname.groups.owner!}/${pathname.groups.name!}`;
			return {
				host: "Codeberg",
				name,
				url: `https://codeberg.org/${name}`
			};
		}
	],
	[
		new URLPattern({
			hostname: "codeberg.org",
			pathname: "/:owner/-/packages/npm/:name(@.+%2F.+)",
			protocol: "http{s}?"
		}),
		({ pathname }: URLPatternResult): TargetMapComponent => {
			return {
				host: "NPM - Codeberg Packages",
				name: `${pathname.groups.owner!}/${decodeURIComponent(pathname.groups.name!)}`,
				url: `https://codeberg.org/${pathname.groups.owner!}/-/packages/npm/${pathname.groups.name!}`
			};
		}
	],
	[
		new URLPattern({
			hostname: "github.com",
			pathname: "/:owner/:name",
			protocol: "http{s}?"
		}),
		({ pathname }: URLPatternResult): TargetMapComponent => {
			const name: string = `${pathname.groups.owner!}/${pathname.groups.name!}`;
			return {
				host: "GitHub",
				name,
				url: `https://github.com/${name}`
			};
		}
	],
	[
		new URLPattern({
			hostname: "github.com",
			pathname: "/:owner/:repository_name/pkgs/npm/:package_name",
			protocol: "http{s}?"
		}),
		({ pathname }: URLPatternResult): TargetMapComponent => {
			return {
				host: "NPM - GitHub Packages",
				name: `@${pathname.groups.owner!}/${pathname.groups.package_name!}`,
				url: `https://github.com/${pathname.groups.owner!}/${pathname.groups.repository_name!}/pkgs/npm/${pathname.groups.package_name!}`
			};
		}
	],
	[
		new URLPattern({
			hostname: "jsr.io",
			pathname: "/:owner(@[\\da-z\\-]+)/:name([\\da-z\\-]+)",
			protocol: "http{s}?"
		}),
		({ pathname }: URLPatternResult): TargetMapComponent => {
			const name: string = `${pathname.groups.owner!}/${pathname.groups.name!}`;
			return {
				host: "JSR",
				name,
				url: `https://jsr.io/${name}`
			};
		}
	],
	[
		new URLPattern({
			hostname: "git.kaki87.net",
			pathname: "/:owner/:name",
			protocol: "http{s}?"
		}),
		({ pathname }: URLPatternResult): TargetMapComponent => {
			const name: string = `${pathname.groups.owner!}/${pathname.groups.name!}`;
			return {
				host: "KaKi87",
				name,
				url: `https://git.kaki87.net/${name}`
			};
		}
	],
	[
		new URLPattern({
			hostname: "git.kaki87.net",
			pathname: "/:owner/-/packages/npm/:name(@.+%2F.+)",
			protocol: "http{s}?"
		}),
		({ pathname }: URLPatternResult): TargetMapComponent => {
			return {
				host: "NPM - KaKi87 Packages",
				name: `${pathname.groups.owner!}/${decodeURIComponent(pathname.groups.name!)}`,
				url: `https://git.kaki87.net/${pathname.groups.owner!}/-/packages/npm/${pathname.groups.name!}`
			};
		}
	],
	[
		new URLPattern({
			hostname: "www.npmjs.com",
			pathname: "/:name((?:@[\\da-z\\-._~]+?\/)?[\\da-z\\-._~]+?)",
			protocol: "http{s}?"
		}),
		({ pathname }: URLPatternResult): TargetMapComponent => {
			const name: string = pathname.groups.name!;
			return {
				host: "NPM",
				name,
				url: `https://www.npmjs.com/${name}`
			};
		}
	]
]);
export const collections = {
	targets: defineCollection({
		loader: file("src/data/targets.yml"),
		schema: zod.object({
			maps: zod.array(zod.url({ normalize: true }).transform((item: string): TargetMapComponent => {
				for (const [
					pattern,
					handler
				] of targetsRemap.entries()) {
					const bin: URLPatternResult | null = pattern.exec(item);
					if (bin !== null) {
						return handler(bin);
					}
				}
				return {
					url: item
				};
			})).min(1),
			name: zod.string()
		})
	})
};
