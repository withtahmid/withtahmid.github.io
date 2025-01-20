async function loadHandlebarsTemplate(url) {
    const response = await fetch(url);
    const source = await response.text();
    return Handlebars.compile(source);
}
