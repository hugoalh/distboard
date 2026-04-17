import { defineConfig } from "astro/config";
import astroRelativeLinks from "astro-relative-links";
const site = defineConfig({
	build: {
		inlineStylesheets: "never"
	},
	integrations: [
		astroRelativeLinks()
	],
	redirects: {}
});
export default site;
