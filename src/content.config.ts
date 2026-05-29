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
		({ hostname, pathname }: URLPatternResult): TargetMapComponent => {
			return {
				host: "Codeberg",
				name: `${pathname.groups.owner!}/${pathname.groups.name!}`,
				url: `https://${hostname.input}${pathname.input}`
			};
		}
	],
	[
		new URLPattern({
			hostname: "codeberg.org",
			pathname: "/:owner/-/packages/npm/:name(@.+%2F.+)",
			protocol: "http{s}?"
		}),
		({ hostname, pathname }: URLPatternResult): TargetMapComponent => {
			return {
				host: "Codeberg Packages - NPM",
				name: `${pathname.groups.owner!}/${decodeURIComponent(pathname.groups.name!)}`,
				url: `https://${hostname.input}${pathname.input}`
			};
		}
	],
	[
		new URLPattern({
			hostname: "github.com",
			pathname: "/:owner/:name",
			protocol: "http{s}?"
		}),
		({ hostname, pathname }: URLPatternResult): TargetMapComponent => {
			return {
				host: "GitHub",
				name: `${pathname.groups.owner!}/${pathname.groups.name!}`,
				url: `https://${hostname.input}${pathname.input}`
			};
		}
	],
	[
		new URLPattern({
			hostname: "github.com",
			pathname: "/users/:owner/packages/npm/package/:name",
			protocol: "http{s}?"
		}),
		({ hostname, pathname }: URLPatternResult): TargetMapComponent => {
			return {
				host: "GitHub Packages - NPM",
				name: `@${pathname.groups.owner!}/${pathname.groups.name!}`,
				url: `https://${hostname.input}${pathname.input}`
			};
		}
	],
	[
		new URLPattern({
			hostname: "jsr.io",
			pathname: "/:owner(@[\\da-z\\-]+)/:name([\\da-z\\-]+)",
			protocol: "http{s}?"
		}),
		({ hostname, pathname }: URLPatternResult): TargetMapComponent => {
			return {
				host: "JSR",
				name: `${pathname.groups.owner!}/${pathname.groups.name!}`,
				url: `https://${hostname.input}${pathname.input}`
			};
		}
	],
	[
		new URLPattern({
			hostname: "git.kaki87.net",
			pathname: "/:owner/:name",
			protocol: "http{s}?"
		}),
		({ hostname, pathname }: URLPatternResult): TargetMapComponent => {
			return {
				host: "KaKi87",
				name: `${pathname.groups.owner!}/${pathname.groups.name!}`,
				url: `https://${hostname.input}${pathname.input}`
			};
		}
	],
	[
		new URLPattern({
			hostname: "git.kaki87.net",
			pathname: "/:owner/-/packages/npm/:name(@.+%2F.+)",
			protocol: "http{s}?"
		}),
		({ hostname, pathname }: URLPatternResult): TargetMapComponent => {
			return {
				host: "KaKi87 Packages - NPM",
				name: `${pathname.groups.owner!}/${decodeURIComponent(pathname.groups.name!)}`,
				url: `https://${hostname.input}${pathname.input}`
			};
		}
	],
	[
		new URLPattern({
			hostname: "www.npmjs.com",
			pathname: "/:name((?:@[\\da-z\\-._~]+?\/)?[\\da-z\\-._~]+?)",
			protocol: "http{s}?"
		}),
		({ hostname, pathname }: URLPatternResult): TargetMapComponent => {
			return {
				host: "NPM",
				name: pathname.groups.name!,
				url: `https://${hostname.input}${pathname.input}`
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
