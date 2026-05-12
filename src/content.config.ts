import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z as zod } from "astro/zod";
import type { TargetMapComponent } from "./components/build.js";
/*
const zodTargetNPMForgejo = zod.stringFormat("target-npm-forgejo", /^(?:@[\da-z\-._~]+?\/)?[\da-z\-._~]+?$/);
const zodTargetNPMNPM = zod.stringFormat("target-npm-npm", /^(?:@[\da-z\-._~]+?\/)?[\da-z\-._~]+?$/);
const zodTargetRepository = zod.stringFormat("target-repository", /^[\d\w\-.]+?\/[\d\w\-.]+?(?:\/[\d\w\-.]+?)*$/);
*/
const urlPatternCodeberg = new URLPattern({
	hostname: "codeberg.org",
	pathname: "/:owner/:name",
	protocol: "http{s}?"
});
const urlPatternGitHub = new URLPattern({
	hostname: "github.com",
	pathname: "/:owner/:name",
	protocol: "http{s}?"
});
const urlPatternJSR = new URLPattern({
	hostname: "jsr.io",
	pathname: "/:owner(@[\\da-z\\-]+)/:name([\\da-z\\-]+)",
	protocol: "http{s}?"
});
const urlPatternKaKi87 = new URLPattern({
	hostname: "git.kaki87.net",
	pathname: "/:owner/:name",
	protocol: "http{s}?"
});
const urlPatternNPM = new URLPattern({
	hostname: "www.npmjs.com",
	pathname: "/:name((?:@[\\da-z\\-._~]+?\/)?[\\da-z\\-._~]+?)",
	protocol: "http{s}?"
});
export const collections = {
	targets: defineCollection({
		loader: file("src/data/targets.yml"),
		schema: zod.object({
			maps: zod.array(zod.url({ normalize: true }).transform((item: string): TargetMapComponent => {
				let bin: URLPatternResult | null;
				bin = urlPatternCodeberg.exec(item);
				if (bin !== null) {
					const name: string = `${bin.pathname.groups.owner!}/${bin.pathname.groups.name!}`;
					return {
						host: "Codeberg",
						name,
						url: `https://codeberg.org/${name}`
					};
				}
				bin = urlPatternGitHub.exec(item);
				if (bin !== null) {
					const name: string = `${bin.pathname.groups.owner!}/${bin.pathname.groups.name!}`;
					return {
						host: "GitHub",
						name,
						url: `https://github.com/${name}`
					};
				}
				bin = urlPatternJSR.exec(item);
				if (bin !== null) {
					const name: string = `${bin.pathname.groups.owner!}/${bin.pathname.groups.name!}`;
					return {
						host: "JSR",
						name,
						url: `https://jsr.io/${name}`
					};
				}
				bin = urlPatternKaKi87.exec(item);
				if (bin !== null) {
					const name: string = `${bin.pathname.groups.owner!}/${bin.pathname.groups.name!}`;
					return {
						host: "KaKi87",
						name,
						url: `https://git.kaki87.net/${name}`
					};
				}
				bin = urlPatternNPM.exec(item);
				if (bin !== null) {
					const name: string = bin.pathname.groups.name!;
					return {
						host: "NPM",
						name,
						url: `https://www.npmjs.com/${name}`
					};
				}
				return {
					url: item
				};
			})).min(1),
			name: zod.string()
		})
	})
};
