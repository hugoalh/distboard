if (typeof Intl !== "undefined" && typeof Intl.RelativeTimeFormat !== "undefined") {
	const intlRTF = new Intl.RelativeTimeFormat("en");
	const timestampCurrent = new Date();
	async function resolveTimeboxRelative(element: Element): Promise<void> {
		const wrapEnd: string | null = element.getAttribute("data-relative-wrap-end");
		const wrapStart: string | null = element.getAttribute("data-relative-wrap-start");
		const timestampTarget: Date = new Date(element.querySelector("time.absolute")!.getAttribute("datetime")!);
		const tdSeconds: number = (timestampTarget.getTime() - timestampCurrent.getTime()) / 1000;
		const tdMinutes: number = tdSeconds / 60;
		const tdHours: number = tdMinutes / 60;
		const tdDays: number = tdHours / 24;
		const tdMonths: number = tdDays / 30.4375;
		const tdYears: number = tdMonths / 12;
		const domRelativeTime: HTMLTimeElement = document.createElement("time");
		if (Math.abs(tdSeconds) < 60) {
			const v: number = Math.ceil(tdSeconds);
			domRelativeTime.setAttribute("datetime", `PT${Math.abs(v)}S`);
			domRelativeTime.textContent = intlRTF.format(v, "second");
		} else if (Math.abs(tdMinutes) < 60) {
			const v: number = Math.ceil(tdMinutes);
			domRelativeTime.setAttribute("datetime", `PT${Math.abs(v)}M`);
			domRelativeTime.textContent = intlRTF.format(v, "minute");
		} else if (Math.abs(tdHours) < 24) {
			const v: number = Math.ceil(tdHours);
			domRelativeTime.setAttribute("datetime", `PT${Math.abs(v)}H`);
			domRelativeTime.textContent = intlRTF.format(v, "hour");
		} else if (Math.abs(tdDays) < 30.4375) {
			const v: number = Math.ceil(tdDays);
			domRelativeTime.setAttribute("datetime", `P${Math.abs(v)}D`);
			domRelativeTime.textContent = intlRTF.format(v, "day");
		} else if (Math.abs(tdMonths) < 12) {
			domRelativeTime.setAttribute("datetime", `P${Math.abs(Math.ceil(tdDays))}D`);
			domRelativeTime.textContent = intlRTF.format(Math.ceil(tdMonths), "month");
		} else {
			domRelativeTime.setAttribute("datetime", `P${Math.abs(Math.ceil(tdDays))}D`);
			domRelativeTime.textContent = intlRTF.format(Math.ceil(tdYears), "year");
		}
		const domRelative: HTMLSpanElement = document.createElement("span");
		domRelative.classList.add("relative");
		if (wrapStart !== null) {
			domRelative.append(wrapStart);
		}
		domRelative.append(domRelativeTime);
		if (wrapEnd !== null) {
			domRelative.append(wrapEnd);
		}
		element.querySelector("span.relative")?.remove();
		element.append(domRelative);
	}
	try {
		for (const element of document.querySelectorAll("span.timebox")) {
			resolveTimeboxRelative(element).catch((error): void => {
				console.warn(error);
			});
		}
	} catch (error) {
		console.warn(error);
	}
}
