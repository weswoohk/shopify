if (typeof TruncatedHTML !== "function") {
	class TruncatedHTML extends HTMLElement {

		constructor() {

			super();

			this.content = this.innerHTML;
			this.limit = this.dataset.limit;
			const ending = this.dataset.ending;

			this.innerHTML = truncateHtmlByWords(this.content, this.limit);

			function truncateHtmlByWords(html, wordLimit) {
				const parser = new DOMParser();
				const doc = parser.parseFromString(html, 'text/html');
				let wordCount = 0;
				let result = '';
				let isTruncated = false;
		
				const processNode = node => {
					if (wordCount >= wordLimit) {
						if (!isTruncated) {
							result = result.trim() + ending;
							isTruncated = true;
						}
						return;
					}
	
					if (node.nodeType === Node.TEXT_NODE) {
						let words = node.textContent.trim().split(/\s+/);
						words.forEach(word => {
							if (wordCount < wordLimit) {
								result += word + ' ';
								wordCount++;
							} else if (!isTruncated) {
								result = result.trim() + ending;
								isTruncated = true;
							}
						});
					} else if (node.nodeType === Node.ELEMENT_NODE) {
						result += `<${node.tagName.toLowerCase()}>`;
						node.childNodes.forEach(processNode);
						result += `</${node.tagName.toLowerCase()}>`;
					}
				};
		
				doc.body.childNodes.forEach(processNode);
		
				if (!isTruncated && wordCount > 0) {
					result = result.trim();
				}
		
				return result;
			}
		}
	}

	if (typeof customElements.get("truncated-html") == "undefined") {
		customElements.define("truncated-html", TruncatedHTML);
	}
	
}