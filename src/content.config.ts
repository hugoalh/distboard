import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z as zod } from "astro/zod";
import type { TargetMapFmt } from "./components/build.js";
/*
const zodJSRNamespace = zod.stringFormat("jsr-namespace", /^[\da-z\-]+$/);
const zodTargetNPMForgejo = zod.stringFormat("target-npm-forgejo", /^(?:@[\da-z\-._~]+?\/)?[\da-z\-._~]+?$/);
const zodTargetNPMNPM = zod.stringFormat("target-npm-npm", /^(?:@[\da-z\-._~]+?\/)?[\da-z\-._~]+?$/);
const zodTargetRepository = zod.stringFormat("target-repository", /^[\d\w\-.]+?\/[\d\w\-.]+?(?:\/[\d\w\-.]+?)*$/);
*/
const zodTargetMapCodeberg = zod.stringFormat("target-codeberg", (item: string): boolean => {
	const itemSplit: string[] = item.split("/");
	return (itemSplit.length === 3 && itemSplit[0] === "codeberg");
}).transform((item: string): TargetMapFmt => {
	const name: string = item.replace("codeberg/", "");
	return {
		hostDisplay: "Codeberg",
		hostSlug: "codeberg",
		name,
		slug: item,
		url: `https://codeberg.org/${name}`
	};
});
const zodTargetMapGitHub = zod.stringFormat("target-github", (item: string): boolean => {
	const itemSplit: string[] = item.split("/");
	return (itemSplit.length === 3 && itemSplit[0] === "github");
}).transform((item: string): TargetMapFmt => {
	const name: string = item.replace("github/", "");
	return {
		hostDisplay: "GitHub",
		hostSlug: "github",
		name,
		slug: item,
		url: `https://github.com/${name}`
	};
});
const zodTargetMapJSR = zod.stringFormat("target-jsr", (item: string): boolean => {
	const itemSplit: string[] = item.split("/");
	return (itemSplit.length === 3 && itemSplit[0] === "jsr");
}).transform((item: string): TargetMapFmt => {
	const name: string = item.replace("jsr/", "");
	return {
		hostDisplay: "JSR",
		hostSlug: "jsr",
		name,
		slug: item,
		url: `https://jsr.io/${name}`
	};
});
const zodTargetMapKaKi87 = zod.stringFormat("target-kaki87", (item: string): boolean => {
	const itemSplit: string[] = item.split("/");
	return (itemSplit.length === 3 && itemSplit[0] === "kaki87");
}).transform((item: string): TargetMapFmt => {
	const name: string = item.replace("kaki87/", "");
	return {
		hostDisplay: "KaKi87",
		hostSlug: "kaki87",
		name,
		slug: item,
		url: `https://git.kaki87.net/${name}`
	};
});
const zodTargetMapNPM = zod.stringFormat("target-npm", (item: string): boolean => {
	const itemSplit: string[] = item.split("/");
	return (itemSplit.length >= 2 && itemSplit.length <= 3 && itemSplit[0] === "npm");
}).transform((item: string): TargetMapFmt => {
	const name: string = item.replace("npm/", "");
	return {
		hostDisplay: "NPM",
		hostSlug: "npm",
		name,
		slug: item,
		url: `https://www.npmjs.com/${name}`
	};
});
export const collections = {
	targets: defineCollection({
		loader: file("src/data/targets.yml"),
		schema: zod.object({
			maps: zod.array(zod.union([
				zodTargetMapCodeberg,
				zodTargetMapGitHub,
				zodTargetMapJSR,
				zodTargetMapKaKi87,
				zodTargetMapNPM
			])).min(1),
			name: zod.string()
		})
	})
};
